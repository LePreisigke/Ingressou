// Importa os pacotes necessários
const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models'); // Importa a conexão do Sequelize (do models/index.js)

// Inicializa o aplicativo Express
const app = express();

// === Middlewares Essenciais ===

// 1. Habilita o CORS para que seu frontend React (em localhost:3000 ou 5173) 
//    possa se comunicar com seu backend (em localhost:8000)
app.use(cors());

// 2. Habilita o Express para entender JSON no corpo das requisições (ex: req.body)
app.use(express.json());

// === Nossas Rotas da API (Ainda vazias) ===
// Ex: app.use('/api/auth', authRoutes);
// Ex: app.use('/api/games', gameRoutes);


// === Rota de Teste ===
app.get('/api/test', (req, res) => {
  res.status(200).json({
    message: 'Olá! O backend Ingressou está funcionando!',
  });
});

// === Inicialização do Servidor ===
const PORT = process.env.PORT || 8080;

app.listen(PORT, async () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  
  // Tenta autenticar com o banco de dados
  try {
    await sequelize.authenticate();
    console.log('Conexão com o banco de dados PostgreSQL estabelecida com sucesso!');
  } catch (error) {
    console.error('Não foi possível conectar ao banco de dados:', error);
  }
});