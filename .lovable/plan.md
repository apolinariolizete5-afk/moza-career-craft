# Moza Empregos — Fase 1: Base, Vagas e Navegação App

Construir aqui, de raiz, o núcleo do Moza Empregos: identidade visual própria, navegação com experiência de aplicação, e um sistema de vagas real com base de dados. O Criador de CV, IA e pagamentos ficam para fases seguintes, mas a arquitetura já é preparada para eles.

## Identidade visual

Identidade original de Moza Empregos (nada copiado de LinkedIn/Canva):
- Paleta própria em tons de verde-esmeralda profundo com acento coral/âmbar quente (referência moçambicana), neutros quentes, modo claro e escuro.
- Tipografia com títulos fortes e corpo altamente legível.
- Cartões suaves, cantos arredondados, sombras discretas, animações mínimas.
- Tudo em tokens semânticos de design, mobile-first (320px a 1440px), sem scroll horizontal.

## Navegação

Mobile: barra inferior fixa com INÍCIO, VAGAS, CRIAR CV, PESQUISAR, PERFIL. Todos os itens navegam para páginas reais. Safe areas respeitadas e espaço no fundo para a barra nunca tapar conteúdo.

Desktop: header profissional com logo, navegação horizontal, pesquisa e área de perfil/notificações. A barra inferior desaparece.

Header compacto em todas as páginas, com sino de notificações.

## Páginas desta fase

- **/** — Início: header, pesquisa de vagas, categorias, vagas recentes, vagas recomendadas, empresas, bloco de apresentação do Criador de CV.
- **/vagas** — Listagem com pesquisa e filtros por localização, categoria, tipo de emprego, experiência e data. Filtros refletidos no URL (partilháveis). Cada cartão mostra título, empresa, localização, categoria, tipo, data, resumo, "Ver vaga" e guardar.
- **/vagas/$slug** — Página da vaga: título, empresa, localização, tipo, data, descrição, responsabilidades, requisitos, benefícios. Botões reais de Candidatar-se e Guardar. SEO por vaga (título, descrição, og, JSON-LD JobPosting).
- **/pesquisar** — Pesquisa dedicada com sugestões e resultados.
- **/empresas** e **/empresas/$slug** — Perfis de empresa com as suas vagas.
- **/criar-cv** — Página de apresentação do Criador de CV (o editor completo entra na Fase 2).
- **/perfil** — Área do utilizador (vagas guardadas, candidaturas, notificações) com convite a entrar quando não autenticado.
- **/auth** — Entrar e criar conta.
- **/notificacoes** — Lista de notificações do utilizador autenticado.

Visitantes sem sessão podem pesquisar, ver vagas e abrir detalhes. Guardar, candidatar-se e notificações pedem sessão de forma discreta, sem redirecionamentos bruscos.

## Backend (Lovable Cloud)

Ativar Lovable Cloud e criar:
- `companies` — nome, slug, logo, descrição, localização, website.
- `jobs` — título, slug, empresa, localização, categoria, tipo, nível de experiência, salário, resumo, descrição, responsabilidades, requisitos, benefícios, data de publicação, expiração, estado (rascunho/publicada).
- `saved_jobs` — vaga guardada por utilizador.
- `applications` — candidatura com estado e data.
- `notifications` — notificações por utilizador, com estado de leitura.
- `profiles` — perfil básico do utilizador.
- `user_roles` — tabela separada de papéis, com função de verificação segura (para o painel de publicação de vagas).

Leitura pública apenas das vagas e empresas publicadas; tudo o resto restrito ao dono. Autenticação por email/palavra-passe e Google.

Painel simples em **/admin/vagas** (apenas administradores) para publicar e editar vagas reais — nada de vagas inventadas na base de dados de produção.

## Preparação para as fases seguintes

- Estrutura de rotas e tabelas já pensada para: Criador de CV com 20 modelos, exportação PDF/Word, preenchimento automático com Gemini, e pagamentos PaySuite (pedidos com referência, valor, produto, utilizador, estado, transaction ID, data, método) com libertação de acesso apenas via webhook.
- Nenhuma credencial no código; todas as chaves ficam em variáveis de ambiente do lado do servidor.

## Nota técnica

Stack: TanStack Start + React + Tailwind, dados via server functions e TanStack Query, rotas em `src/routes`. Lovable Cloud fornece base de dados, autenticação e funções de servidor — não é preciso configurar nada externamente. O deploy sai deste projeto; se quiser manter o Render, ligamos depois o projeto ao GitHub.

## Verificação antes de terminar

Build, rotas, navegação real em todos os itens, filtros funcionais, guardar/candidatar reais, responsividade a 320/360/390/414/768/1024/1440, sem scroll horizontal e sem botões decorativos.
