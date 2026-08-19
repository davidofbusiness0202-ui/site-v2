# PRD — MQ Rifa (Rifa Online MQ Assistência)

## Problem Statement (original)
Site de rifa online para divulgação via Meta Ads. Tema preto e amarelo, estilo "hiper x cap". 500 números a R$ 5,00 cada, prazo de até 30 dias. Prêmios: Smart Watch X10 Ultra 3 47mm (2 pulseiras), Apple AirPods Pro 3ª geração Linha Premium, Carregador Turbo 120W Samsung Tipo C Linha Premium, Caixa de Som Bluetooth à prova d'água. Localização da loja física: Rua João Borges da Matt, Q9 Lt 14 — MQ Assistência. Botões de Instagram e WhatsApp sem exibir os links.

## Arquitetura
- Frontend: React + Tailwind + framer-motion + lenis + react-fast-marquee (port 3000)
- Backend: FastAPI (port 8001), rotas sob /api
- Banco: MongoDB (coleções: raffle_config, orders)
- Sem autenticação (app público de rifa)

## Personas
- Comprador vindo de anúncio Meta Ads (mobile-first): quer ver prêmios, escolher números e pagar via Pix no WhatsApp
- Comprador que já comprou: quer consultar seus números pelo telefone
- Dono da rifa (MQ Assistência): recebe pedidos e comprovantes via WhatsApp

## Requisitos Core (estáticos)
- 500 números, R$ 5,00 cada, prazo 30 dias (contagem regressiva)
- Vitrine dos 4 prêmios com as fotos oficiais enviadas pelo usuário
- Grade interativa com estados: disponível / selecionado / reservado
- Checkout com nome + telefone → reserva no banco → direciona ao WhatsApp
- Consulta de números por telefone
- Mapa do Google com a loja física
- Botões Instagram (instagram.com/mqcell06) e WhatsApp (wa.me/message/Y75R6GYC573RK1) sem exibir URLs

## Implementado (19/08/2026)
- Hero cinético com reveal linha a linha, contagem regressiva 30 dias, parallax
- Marquee editorial amarelo (compra segura, Pix, etc.)
- Vitrine bento dos 4 prêmios com fotos oficiais (mapping corrigido após verificação)
- Grade de 500 números com seleção múltipla, surpresinha (5/10 aleatórios), barra de progresso de vendidos
- Checkout: modal com nome/telefone, reserva via POST /api/orders, detecção de conflito (409), tela de sucesso com "Copiar pedido" + "Chamar no WhatsApp"
- Consulta de pedidos por telefone (GET /api/orders/lookup)
- Seção loja física com endereço + iframe Google Maps
- Botões flutuantes WhatsApp/Instagram + footer
- Smooth scroll (lenis), grain overlay, tema preto #0a0a0a + amarelo #FFD400, fontes Cabinet Grotesk/Inter/JetBrains Mono

## Pendente / Backlog
- P0: Endereço do mapa sem cidade/estado — Google não localizou o ponto exato (mapa mostra visão ampla). Usuário deve informar cidade/UF para corrigir o pin.
- P1: Painel admin para marcar pedidos como pagos e liberar/cancelar reservas
- P1: Expiração automática de reservas não pagas (ex.: 24h)
- P2: Página de ganhadores / resultado do sorteio
- P2: Pixel do Meta Ads para rastreamento de conversão

## Próximas tarefas
1. Corrigir pin do mapa com cidade/estado
2. Admin simples de pedidos
3. Meta Pixel
