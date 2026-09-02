# Moza Empregos App

QUERO TRANSFORMAR ESTE REPOSITÓRIO:



https://github.com/apolinariolizete5-afk/mozaempregos-



NO PRODUTO PRINCIPAL DO MOZA EMPREGOS.



IMPORTANTE:

TRABALHAR DIRETAMENTE NESTE REPOSITÓRIO.



NÃO CRIAR UM PROJETO SEPARADO.

NÃO SUBSTITUIR O PROJETO POR UMA DEMO.

INTEGRAR TODAS AS NOVAS FUNCIONALIDADES NA ESTRUTURA EXISTENTE.



==================================================

VISÃO DO PRODUTO

==================================================



Quero que o Moza Empregos deixe de parecer apenas um website tradicional e passe a ter a experiência de uma aplicação profissional de empregos.



A referência é a estrutura mobile que forneci anteriormente:



- navegação inferior;

- cartões;

- pesquisa;

- vagas;

- criação de CV;

- notificações;

- perfil;

- experiência semelhante a uma app.



Criar uma identidade ORIGINAL para Moza Empregos.



Não copiar diretamente LinkedIn, Canva ou qualquer outro site.



Usar padrões modernos de UX/UI apenas como inspiração.



==================================================

NAVEGAÇÃO MOBILE

==================================================



Criar uma barra inferior fixa no telemóvel:



INÍCIO

VAGAS

CRIAR CV

PESQUISAR

PERFIL



Adicionar notificações no header/perfil.



A navegação deve funcionar realmente.



Não criar elementos apenas decorativos.



No desktop, adaptar a navegação para uma estrutura profissional de desktop.



==================================================

HOME

==================================================



Redesenhar completamente a página inicial.



Estrutura:



Header

↓

Pesquisa de vagas

↓

Categorias

↓

Vagas recentes

↓

Vagas recomendadas

↓

Empresas

↓

Criador de CV

↓

Conteúdo adicional existente



A página deve parecer uma aplicação moderna.



Prioridade absoluta para telemóvel.



==================================================

VAGAS

==================================================



Criar uma experiência profissional de pesquisa de empregos.



Cada vaga deve apresentar:



- título;

- empresa;

- localização;

- categoria;

- tipo de emprego;

- data;

- resumo;

- botão "Ver vaga";

- guardar vaga.



Criar filtros por:



- localização;

- categoria;

- tipo de emprego;

- experiência;

- data.



A pesquisa deve funcionar com os dados existentes.



Não inventar vagas falsas se já existir uma fonte de dados no projeto.



==================================================

PÁGINA DA VAGA

==================================================



Criar uma página profissional para cada vaga:



Título

Empresa

Localização

Tipo

Data

Descrição

Responsabilidades

Requisitos

Benefícios, quando disponíveis



Botões:



Candidatar-se

Guardar vaga



Os botões devem funcionar de verdade.



==================================================

CRIADOR DE CV

==================================================



INTEGRAR O CRIADOR DE CV NO MESMO MOZA EMPREGOS.



Não criar outro domínio ou outro projeto.



Criar uma área:



/criar-cv



ou estrutura equivalente compatível com a arquitetura existente.



Fluxo:



Escolher modelo

↓

Dados pessoais

↓

Perfil profissional

↓

Experiência

↓

Formação

↓

Competências

↓

Idiomas

↓

Cursos/certificações

↓

Fotografia

↓

Preview

↓

PDF / Word



No mobile deve funcionar como um fluxo por etapas.



No desktop:



EDITOR | PREVIEW



==================================================

TEMPLATES PREMIUM

==================================================



Criar 20 templates de CV profissionais.



Não copiar templates do Canva ou de outros sites.



Criar templates ORIGINAIS inspirados nas tendências atuais de CVs profissionais.



Estilos:



- Executive

- Corporate

- Modern

- Minimal

- Creative

- Editorial

- ATS-friendly

- Elegant

- Professional

- Bold



Os templates devem possuir:



- títulos fortes;

- excelente hierarquia tipográfica;

- boa utilização de espaço;

- formato A4;

- várias páginas;

- boa impressão;

- excelente exportação PDF;

- aparência premium.



Os 20 modelos devem realmente ter diferenças de layout.



==================================================

IA / GEMINI

==================================================



Integrar o preenchimento automático de CV com Gemini.



A GEMINI_API_KEY deve permanecer exclusivamente no backend.



Fluxo:



Upload PDF/Word

↓

extração do conteúdo

↓

Gemini

↓

dados estruturados

↓

preenchimento automático

↓

edição pelo utilizador

↓

escolha do modelo

↓

exportação



Se Gemini não estiver configurado, o editor manual deve continuar funcionando.



Não utilizar dados falsos para simular IA.



==================================================

PDF E WORD

==================================================



Garantir:



BAIXAR PDF

→ gera PDF real

→ formato A4

→ conteúdo completo

→ download real



BAIXAR WORD

→ gera .DOCX real

→ conteúdo completo

→ download real



Nenhum botão pode ser apenas visual.



Verificar todos os handlers e eventos.



==================================================

PAGAMENTOS MOÇAMBICANOS

==================================================



INTEGRAR PAYSUITE.



A conta PaySuite do proprietário já existe.



Não colocar credenciais diretamente no código.



Usar variáveis de ambiente no Render.



Preparar integração para os métodos disponíveis na conta PaySuite, incluindo:



- M-Pesa

- e-Mola

- mKesh

- Ponto24

- Visa

- Mastercard



Não assumir que todos estão ativos na conta sem verificar a configuração disponível.



A PaySuite disponibiliza API e callbacks/webhooks para confirmação de pagamentos.



Implementar o pagamento no BACKEND.



Nunca colocar private key/API credentials no frontend.



==================================================

PRODUTOS PAGOS

==================================================



Preparar pagamentos para funcionalidades premium, por exemplo:



- download de CV premium;

- templates premium;

- funcionalidades premium do Criador de CV;

- outros produtos digitais do Moza Empregos.



Criar uma estrutura de pedidos/pagamentos com:



- referência única;

- valor;

- produto;

- utilizador;

- estado;

- transaction ID;

- data;

- método de pagamento.



Estados:



pending

paid

failed

cancelled



IMPORTANTE:



O acesso premium só deve ser concedido depois de uma confirmação válida do pagamento.



NÃO confiar apenas no redirect do navegador.



Usar callback/webhook do PaySuite para confirmação no servidor.



==================================================

EXPERIÊNCIA DE PAGAMENTO

==================================================



Criar uma página/checkout profissional:



Produto

Preço em MZN

Resumo

Método de pagamento

Pagamento

Estado da transação



Após pagamento confirmado:



→ mostrar sucesso

→ liberar o produto/funcionalidade

→ permitir download



Se falhar:



→ mostrar erro

→ permitir tentar novamente



==================================================

UTILIZADOR NÃO AUTENTICADO

==================================================



Quem entra pelo Chrome sem login pode:



- pesquisar vagas;

- ver vagas;

- abrir detalhes;

- utilizar funcionalidades públicas;

- conhecer o Criador de CV.



Não mostrar informações privadas.



==================================================

UTILIZADOR AUTENTICADO

==================================================



Criar área preparada para:



- perfil;

- CVs;

- vagas guardadas;

- candidaturas;

- notificações;

- compras;

- templates premium.



==================================================

NOTIFICAÇÕES

==================================================



Criar estrutura para:



- novas vagas;

- vagas guardadas;

- candidaturas;

- pagamentos;

- disponibilidade de funcionalidades;

- outras notificações relevantes.



Utilizadores não autenticados não devem receber notificações pessoais.



==================================================

APP-LIKE

==================================================



O site deve parecer uma aplicação mesmo quando aberto no Chrome.



Implementar:



- bottom navigation;

- header compacto;

- cards;

- páginas responsivas;

- estados de loading;

- animações discretas;

- navegação simples;

- safe areas;

- touch targets adequados.



A versão APK poderá posteriormente ter:



- splash screen;

- ícone;

- notificações nativas.



A splash screen NÃO deve aparecer quando o utilizador simplesmente abre o site no Chrome.



==================================================

DESIGN

==================================================



Criar uma identidade visual própria para:



MOZA EMPREGOS



O design deve ser:



- profissional;

- moderno;

- premium;

- limpo;

- rápido;

- fácil de navegar;

- mobile-first.



Não exagerar em animações.



Não encher a interface.



Dar prioridade à informação e às vagas.



==================================================

RESPONSIVIDADE

==================================================



Testar:



320px

360px

390px

414px

768px

1024px

1440px



Não permitir:



- scroll horizontal;

- botões cortados;

- elementos sobrepostos;

- menus inacessíveis;

- bottom navigation cobrindo conteúdo.



==================================================

RENDER

==================================================



Manter compatibilidade com o deploy atual.



Não alterar a infraestrutura sem necessidade.



Todas as credenciais devem ser configuradas através de Environment Variables.



Exemplos:



PAYSUITE_PRIVATE_KEY

PAYSUITE_API_KEY

PAYSUITE_CALLBACK_URL

GEMINI_API_KEY



Não inserir valores reais no código.



==================================================

REGRAS CRÍTICAS

==================================================



NÃO remover funcionalidades existentes.



NÃO quebrar as vagas atuais.



NÃO quebrar URLs existentes das vagas.



NÃO quebrar SEO existente.



NÃO quebrar Gemini.



NÃO quebrar PDF.



NÃO quebrar Word.



NÃO expor credenciais.



NÃO criar pagamentos falsos.



NÃO simular confirmação de pagamento.



NÃO criar botões sem funcionalidade.



NÃO criar um projeto separado.



INTEGRAR TUDO NO REPOSITÓRIO ATUAL.



Antes de terminar:



- analisar a arquitetura existente;

- preservar funcionalidades;

- verificar build;

- verificar rotas;

- verificar mobile;

- verificar navegação;

- verificar Criador de CV;

- verificar exportação;

- verificar pagamentos;

- verificar autenticação;

- verificar segurança das variáveis de ambiente.



O RESULTADO FINAL DEVE SER UMA PLATAFORMA MOÇAMBICANA DE EMPREGOS + CRIADOR DE CV + SERVIÇOS PREMIUM, COM EXPERIÊNCIA DE APP MOBILE.



NÃO ENTREGAR APENAS UMA MOCKUP VISUAL.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/d065045d-3bd2-4c54-aaf9-afd003ebb153).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
