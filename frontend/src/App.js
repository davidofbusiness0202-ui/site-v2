import { useCallback, useEffect, useState } from "react";
import Lenis from "lenis";
import axios from "axios";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster, toast } from "sonner";
import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { TrustMarquee } from "./components/TrustMarquee";
import { Prizes } from "./components/Prizes";
import { NumberGrid } from "./components/NumberGrid";
import { CheckoutBar } from "./components/CheckoutBar";
import { CheckoutModal } from "./components/CheckoutModal";
import { Lookup } from "./components/Lookup";
import { LocationSection } from "./components/LocationSection";
import { SocialButtons } from "./components/SocialButtons";
import { Footer } from "./components/Footer";
import AdminPage from "./pages/AdminPage";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

function Home() {
  const [raffle, setRaffle] = useState(null);
  const [selected, setSelected] = useState([]);
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  const fetchRaffle = useCallback(async () => {
    try {
      const res = await axios.get(`${API}/raffle`);
      setRaffle(res.data);
    } catch (e) {
      console.error(e);
    }
  }, []);

  useEffect(() => {
    fetchRaffle();
  }, [fetchRaffle]);

  useEffect(() => {
    const lenis = new Lenis({ autoRaf: true, duration: 1.1 });
    window.__lenis = lenis;
    return () => {
      lenis.destroy();
      window.__lenis = null;
    };
  }, []);

  const toggleNumber = (n) => {
    setSelected((prev) =>
      prev.includes(n) ? prev.filter((x) => x !== n) : [...prev, n].sort((a, b) => a - b)
    );
  };

  const surprise = (qty) => {
    if (!raffle) return;
    const taken = new Set(raffle.taken_numbers);
    const sel = new Set(selected);
    const free = [];
    for (let n = 1; n <= raffle.total_numbers; n++) {
      if (!taken.has(n) && !sel.has(n)) free.push(n);
    }
    for (let i = free.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [free[i], free[j]] = [free[j], free[i]];
    }
    const add = free.slice(0, qty);
    if (add.length === 0) {
      toast.error("Não há números disponíveis suficientes.");
      return;
    }
    setSelected([...selected, ...add].sort((a, b) => a - b));
    toast.success(`${add.length} números da sorte selecionados!`);
  };

  const handleOrderSuccess = () => {
    setSelected([]);
    fetchRaffle();
  };

  const handleConflict = (conflicted) => {
    setSelected((prev) => prev.filter((n) => !conflicted.includes(n)));
    fetchRaffle();
  };

  const total = selected.length * (raffle?.price_per_number ?? 5);

  return (
    <div className="min-h-screen bg-night text-white antialiased">
      <div className="grain-overlay" />
      <Navbar />
      <main>
        <Hero deadline={raffle?.deadline} />
        <TrustMarquee />
        <Prizes />
        <NumberGrid
          raffle={raffle}
          selected={selected}
          onToggle={toggleNumber}
          onSurprise={surprise}
          onClear={() => setSelected([])}
        />
        <Lookup />
        <TrustMarquee />
        <LocationSection />
      </main>
      <Footer />
      <SocialButtons />
      <CheckoutBar
        count={selected.length}
        total={total}
        visible={selected.length > 0 && !checkoutOpen}
        onCheckout={() => setCheckoutOpen(true)}
      />
      <CheckoutModal
        open={checkoutOpen}
        numbers={selected}
        onClose={() => setCheckoutOpen(false)}
        onSuccess={handleOrderSuccess}
        onConflict={handleConflict}
      />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Toaster theme="dark" position="top-center" richColors />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
