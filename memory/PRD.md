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

## Implementado (20/08/2026 — fase 5)
- Olho de ocultar/revelar no resultado da roleta: o número do bilhete e o nome do ganhador aparecem sempre; só o TELEFONE fica mascarado (••• ••••) até clicar no olho; botão Avisar só aparece com o telefone revelado (para a live não vazar o contato do ganhador)

## Implementado (20/08/2026 — fase 4)
- Botão "Avisar" no resultado da roleta: abre o WhatsApp do ganhador com mensagem automática de parabéns (prêmio + número)
- Resultado público: botão "Publicar resultado no site" no painel (exige os 4 ganhadores definidos); seção "Resultado oficial" aparece na home com os 4 números e ganhadores; seções renumeradas (consulta 04, loja 05)

## Implementado (20/08/2026 — fase 3)
- Endereço completo: Rua João Borges da Matt, Q9 Lt 14, Res. Vale do Araguaia, Goiânia - GO, 74735-520. Mapa fixado por coordenadas (-16.6758681, -49.2047908) pois o nome da rua não existe na base do Google
- Área "Sorteio" no painel admin (botão Sorteio ao lado de Ver site): roleta com 500 números por prêmio, gera suspense e para exatamente no número ganhador definido; mostra quem comprou o número (nome, telefone, status) ou "número não vendido"
- Números ganhadores definidos pelo agente (a pedido do usuário): 042 (Smart Watch), 188 (AirPods), 377 (Carregador), 499 (Caixa de Som) — alteráveis no painel

## Implementado (19/08/2026 — fase 2)
- Painel Admin em /admin com senha (JWT 24h): estatísticas (vendidos, pendentes, pagos, arrecadado), lista de pedidos com "Marcar pago" e "Liberar reserva", definição dos 4 números ganhadores (1 por prêmio, só visível no admin, mostra quem comprou o número)
- Ícone de pessoa ao lado do botão Participar leva ao login do admin
- Logo oficial MQ (extraída da arte enviada) no navbar, footer e painel
- Checkout em 2 passos: QR Code Pix gerado no backend (BR Code/EMV com CRC16) já com o valor exato + botão "Pix copia e cola" + chave CNPJ 65.836.767/0001-09
- Automação WhatsApp: botão "Confirmar no WhatsApp" abre wa.me/556295389068 com mensagem automática (nome, números, total, chave Pix)
- Consulta de números: pedidos "aguardando pagamento" ganham botão "Pagar agora" que abre o checkout com QR
- Textos ajustados: 4 números sorteados, 1 prêmio por número (removida ideia de "kit completo")

## Implementado (19/08/2026 — fase 1)
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
