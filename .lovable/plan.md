# Moza Empregos — Fase 2

Trabalho grande. Para gastar menos créditos, faço em 3 entregas seguidas, sem repetir trabalho.

## Entrega 1 — Criador de CV profissional (estilo Canva)
- Substituir os 20 modelos atuais por 20 modelos novos inspirados nas imagens enviadas (foto em círculo/retângulo, barra lateral colorida, cabeçalho escuro, duas colunas, faixa lateral, etc.), todos originais e profissionais.
- Upload de fotografia do utilizador (recorte circular/quadrado conforme o modelo), guardada no rascunho local.
- Galeria de modelos que mostra **os dados do próprio utilizador** em miniatura antes de escolher (pré-visualização como no Canva).
- Exemplos/placeholders em cada campo do formulário (texto de ajuda e exemplo real de preenchimento).
- Upload do CV antigo (PDF/Word/imagem): a IA lê o ficheiro e preenche automaticamente nome, cargo, contactos, resumo, experiências, formação, competências e idiomas. Feito no servidor com a IA da Lovable (chave só no backend).

## Entrega 2 — Pagamento PaySuite + download
- Download do PDF bloqueado até pagamento confirmado (M-Pesa, e-Mola, cartão via PaySuite).
- Backend: criar pagamento + webhook público que confirma e liberta o download; tabela `cv_purchases` com o registo real.
- Preço configurável pelo admin.
- Vou pedir a chave da API PaySuite no formulário seguro quando chegar a esta parte.

## Entrega 3 — Painel de administração + deploy
- Login de admin (papel `admin` já existe na base de dados) em `/admin`, protegido no servidor.
- Gestão de vagas: criar/editar/publicar/fechar/apagar, **imagem da vaga**, e editor com **negrito** e **link dentro de um nome**.
- Gestão de utilizadores: ver, atribuir/remover papéis, ver candidaturas, bloquear.
- Gestão de pagamentos e de posts, painel de visualizações (vagas vistas, candidaturas, downloads de CV, novos utilizadores).
- Preparar deploy no Render (web service): Dockerfile/render.yaml, script de start, variáveis de ambiente, e correção de tudo o que falharia no build.

## Notas técnicas
- Base de dados: novas colunas em `jobs` (`image_url`, `description_html`, `views`), tabelas `cv_purchases`, `job_views`, `app_settings`; políticas de admin para gerir utilizadores e vagas.
- Nada existente é removido: vagas, SEO e navegação atuais mantêm-se.

Começo pela Entrega 1 assim que aprovares.
