# Ingressou - Plataforma de Venda de Ingressos Esportivos

O **Ingressou** é uma aplicação web Full Stack desenvolvida para modernizar a experiência do torcedor, integrando compra de ingressos, informações detalhadas de estádios, cardápios de quiosques e um painel administrativo completo 
para gestão do sistema.

---

## 🚀 Tecnologias Utilizadas

### Frontend
* **React.js** (Vite)
* **Styled Components** (Estilização)
* **Axios** (Consumo de API)
* **React Router Dom** (Navegação)
* **Recharts** (Gráficos do Dashboard)
* **React Toastify** (Notificações)

### Backend
* **Node.js** & **Express**
* **PostgreSQL** (Banco de Dados)
* **Sequelize ORM** (Gerenciamento de Dados)
* **JWT (JSON Web Token)** (Autenticação)
* **BcryptJS** (Criptografia de senhas)

---

## Funcionalidades

### Área Pública & Usuário
* **Vitrine de Jogos:** Listagem de partidas com filtros por estádio e busca por nome.
* **Detalhes do Jogo:** Mapa de setores, preços e seleção de quantidade.
* **Quiosques:** Visualização de opções de alimentação e cardápios detalhados por quiosque.
* **Carrinho & Checkout:** Fluxo completo de compra com simulação de pagamento (Pix/Cartão).
* **Área do Cliente:**
    * Histórico de compras.
    * Ingresso digital com QR Code gerado dinamicamente.
    * Gerenciamento de perfil e favoritos (Times, Estádios, Quiosques).

### Painel Administrativo (Backoffice)
* **Dashboard:** Gráficos de vendas por estádio e indicadores de faturamento.
* **Gerenciamento de Estádios:** CRUD completo (Criar, Listar, Editar, Deletar) com suporte a múltiplos setores.
* **Gerenciamento de Jogos:** Agendamento de partidas.
* **Gerenciamento de Quiosques:** Cadastro de pontos de venda vinculados aos estádios.
* **Gerenciamento de Usuários:** Controle de acesso e promoção de administradores.

---

## Estrutura do Projeto

O projeto está organizado em um **Monorepo**:

* `backend/`: API RESTful, Models, Migrations e Seeders.
* `frontend/`: Aplicação React.

---

## Como Rodar o Projeto

### Pré-requisitos
* Node.js instalado.
* PostgreSQL instalado e rodando.
* Git.

### 1. Configuração do Backend

1.  Entre na pasta do backend:
    ```bash
    cd ingressou-backend
    ```

2.  Instale as dependências:
    ```bash
    npm install
    ```

3.  Configure o banco de dados:
    * Verifique o arquivo `config/config.json` e ajuste seu usuário/senha do Postgres (padrão: `postgres`/`111207` ou sua senha local).

4.  Crie o banco e as tabelas (Migrations):
    ```bash
    npx sequelize-cli db:create
    npx sequelize-cli db:migrate
    ```

5.  Popule o banco com dados iniciais (Seeders):
    * *Isso criará estádios, jogos, quiosques e usuários de teste.*
    ```bash
    npx sequelize-cli db:seed:all
    ```

6.  Inicie o servidor:
    ```bash
    node app.js
    ```
    *O backend rodará na porta **8080**.*

### 2. Configuração do Frontend

1.  Em um novo terminal, entre na pasta do frontend:
    ```bash
    cd ingressou-frontend
    ```

2.  Instale as dependências:
    ```bash
    npm install
    ```

3.  Inicie a aplicação:
    ```bash
    npm start
    ```
    *(Ou `npm run dev`, dependendo da sua configuração).*
    *O frontend rodará na porta **5173** (ou 3000).*

---

## Usuários para Teste

Após rodar os *seeders*, você pode usar os seguintes usuários ou criar um novo:

* **Usuário Comum:** Crie uma conta nova na tela de Registro.
* **Administrador:**
    * Crie uma conta normal.
    * No banco de dados, altere a coluna `is_admin` para `true`.

---

## Autores

* **Anna Laura M. M. Pereira**
* **Letícia Preisigke Boascivis**

Desenvolvido como projeto acadêmico para a disciplina de Engenharia de Software - UNEMAT.
