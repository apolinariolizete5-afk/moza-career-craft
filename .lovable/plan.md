# Próximos passos (lote único, baixo custo)

Objetivo: fechar os pontos críticos que ainda impedem um deploy fiável e um fluxo de pagamento → download correto. Tudo num só lote de alterações, sem trabalho exploratório extra.

## 1. Pagamentos: alinhar nomes e desbloquear o download
- `render.yaml` declara `PAYSUITE_API_KEY` / `PAYSUITE_WEBHOOK_SECRET`, mas o código usa `NETSHOP_API_KEY`, `NETSHOP_WEBHOOK_SECRET` e `NETSHOP_WALLET_ID_1/2`. Uniformizar em `render.yaml` para os nomes `NETSHOP_*` realmente usados (mais `GEMINI_API_KEY`).
- Após regressar da página de pagamento, a app não reverifica o estado: adicionar uma reverificação do acesso (`getCvAccess`) ao voltar à página e um botão "Já paguei — verificar".
- Webhook: tornar idempotente (não reescrever uma compra já `paid`) e validar que o montante recebido corresponde ao preço registado.

## 2. CV: marca de água e download
- Mover a marca de água para dentro de `#cv-print-area`, para que continue visível na impressão/PDF enquanto o pagamento não estiver confirmado.
- Garantir que, depois de pago, o download imprime sem marca de água.

## 3. Segurança
- `parseCvFile` (upload de PDF/Word para a IA) é público — passa a exigir sessão autenticada, evitando abuso da chave de IA.
- Reduzir a validade das URLs assinadas de imagens (10 anos → 1 ano) nos uploads.

## 4. Painel de administração
- Slugs de vagas: garantir unicidade ao publicar (sufixo numérico em caso de colisão).
- Aba "Visualizações": somar o total real de visualizações em vez de apenas as vagas do top.

## Notas técnicas
Ficheiros tocados: `render.yaml`, `src/lib/payments.functions.ts`, `src/routes/api/public/netshop-webhook.ts`, `src/hooks/useCvDownload.ts`, `src/components/cv/CvPreview.tsx` ou `src/routes/criar-cv.tsx`, `src/lib/cv.functions.ts`, `src/components/ImageUpload.tsx`, `src/lib/admin.functions.ts`, `src/routes/admin.tsx`. Sem novas dependências e sem migrações de base de dados. Verificação final: um único typecheck/build.

## O que precisas de fazer no Render
Definir as variáveis: `NETSHOP_API_KEY`, `NETSHOP_WEBHOOK_SECRET`, `NETSHOP_WALLET_ID_1` (e `_2` se aplicável), `GEMINI_API_KEY`, além das `SUPABASE_*`.
