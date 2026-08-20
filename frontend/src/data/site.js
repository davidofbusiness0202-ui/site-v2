const ASSET_BASE =
  "https://customer-assets-0z36b82j.emergentagent.net/job_01d04336-51fc-44f4-8d95-75d19fc65b26/artifacts";

export const WHATSAPP_URL = "https://wa.me/message/Y75R6GYC573RK1";
export const INSTAGRAM_URL = "https://www.instagram.com/mqcell06/";

export const ADDRESS =
  "Rua João Borges da Matt, Q9 Lt 14 — Res. Vale do Araguaia, Goiânia - GO, 74735-520";
export const MAPS_EMBED =
  "https://www.google.com/maps?q=-16.6758681,-49.2047908&z=17&output=embed";
export const MAPS_LINK =
  "https://www.google.com/maps/search/?api=1&query=Rua%20Jo%C3%A3o%20Borges%20da%20Matt%20Q9%20Lt%2014%20Res%20Vale%20do%20Araguaia%20Goi%C3%A2nia%20GO%2074735-520";

export const IMAGES = {
  charger: `${ASSET_BASE}/l39ejkwz_ChatGPT%20Image%2019%20de%20ago.%20de%202026%2C%2016_40_33.png`,
  watch: `${ASSET_BASE}/5rfthvqu_ChatGPT%20Image%2019%20de%20ago.%20de%202026%2C%2016_38_56.png`,
  airpods: `${ASSET_BASE}/fiq3d9l4_ChatGPT%20Image%204%20de%20ago.%20de%202026%2C%2016_44_03.png`,
  speaker: `${ASSET_BASE}/4ji10q6l_ChatGPT%20Image%2019%20de%20ago.%20de%202026%2C%2016_43_05.png`,
};

export const PRIZES = [
  {
    tag: "01",
    name: "Smart Watch X10 Ultra 3",
    detail: "47mm • acompanha 2 pulseiras",
    image: IMAGES.watch,
    span: "md:col-span-7",
  },
  {
    tag: "02",
    name: "Apple AirPods Pro 3ª Geração",
    detail: "Linha Premium",
    image: IMAGES.airpods,
    span: "md:col-span-5",
  },
  {
    tag: "03",
    name: "Carregador Turbo 120W Samsung",
    detail: "Tipo C • Linha Premium",
    image: IMAGES.charger,
    span: "md:col-span-5",
  },
  {
    tag: "04",
    name: "Caixa de Som Bluetooth",
    detail: "À prova d'água",
    image: IMAGES.speaker,
    span: "md:col-span-7",
  },
];

export const pad = (n) => String(n).padStart(3, "0");

export const brl = (v) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export const PIX_KEY = "65.836.767/0001-09";

// Número do WhatsApp da loja (DDI + DDD + número, só dígitos) — ativa a mensagem automática.
export const WHATSAPP_NUMBER = "556295389068";

export const buildWhatsAppUrl = (text) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;

export const buildOrderText = (order) =>
  `Olá! Acabei de reservar meus números na Rifa MQ Assistência.\nNome: ${order.name}\nNúmeros: ${order.numbers.map(pad).join(", ")}\nTotal: ${brl(order.total)}\nPix (CNPJ): ${PIX_KEY}\nSegue meu comprovante para confirmar.`;
