// Importa o dotenv para carregar variáveis de ambiente
require('dotenv').config();

// Importa os pacotes
const express = require('express');
const cors = require('cors');

// Importa a conexão com o banco
const db = require('./models');

// Inicializa o aplicativo Express
const app = express();

// --- Configurações (Middlewares) ---
app.use(express.json());
app.use(cors());

// --- Importação de Rotas ---
const authRoutes = require('./routes/authRoutes'); 
const estadioRoutes = require('./routes/estadioRoutes');
const jogoRoutes = require('./routes/jogoRoutes');
const feedbackRoutes = require('./routes/feedbackRoutes');
const ingressoRoutes = require('./routes/ingressoRoutes');
const perfilRoutes = require('./routes/perfilRoutes');
const quiosqueRoutes = require('./routes/quiosqueRoutes');
const cardapioRoutes = require('./routes/cardapioRoutes');
const usuarioRoutes = require('./routes/usuarioRoutes');
const adminRoutes = require('./routes/adminRoutes');

// --- Rotas ---
app.get('/', (req, res) => {
  res.json({ message: 'API do Ingressou está online!' });
});

// Use as rotas de autenticação
app.use('/api/auth', authRoutes); 
app.use('/api/estadios', estadioRoutes);
app.use('/api/jogos', jogoRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/ingressos', ingressoRoutes);
app.use('/api/perfil', perfilRoutes);
app.use('/api/quiosques', quiosqueRoutes);
app.use('/api/cardapios', cardapioRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/admin', adminRoutes);

// --- Inicialização do Servidor ---
const PORT = process.env.PORT || 8080;

app.listen(PORT, async () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log('Ambiente: ' + (process.env.NODE_ENV || 'development'));

  // --- Conexão com o Banco ---
  try {
    await db.sequelize.authenticate();
    console.log('✅ Conexão com o banco de dados PostgreSQL estabelecida com sucesso.');
  } catch (error) {
    console.error('❌ Erro ao conectar com o banco de dados:', error);
  }
});