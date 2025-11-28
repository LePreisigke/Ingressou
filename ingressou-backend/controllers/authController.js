// controllers/authController.js

const db = require('../models'); // Importa o 'models/index.js'
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Carrega o 'JWT_SECRET' do .env
const JWT_SECRET = process.env.JWT_SECRET || 'seu_segredo_super_secreto_local';

// Vamos usar o model Usuario que definimos
const Usuario = db.Usuario;

// --- FUNÇÃO DE REGISTRO ---
exports.registrar = async (req, res) => {
  try {
    // 1. Pegar os dados do body
    const { 
      nome, 
      email, 
      senha, 
      telefone, 
      pais, 
      cidade, 
      cep, 
      bairro, 
      rua, 
      numero, 
      complemento 
    } = req.body;

    // 2. Validar se o email já existe
    const usuarioExistente = await Usuario.findOne({ where: { email: email } });
    if (usuarioExistente) {
      return res.status(400).json({ message: 'Este e-mail já está em uso.' });
    }

    // 3. Criptografar a senha
    const senhaHash = await bcrypt.hash(senha, 10); // 10 é o 'custo' do hash

    // 4. Criar o usuário no banco
    const novoUsuario = await Usuario.create({
      nome,
      email,
      senha_hash: senhaHash, // Salva o hash, não a senha
      telefone,
      pais,
      cidade,
      cep,
      bairro,
      rua,
      numero,
      complemento
      // Nota: Os campos 'favoritos' e 'timestamps' serão tratados
      // pelo Sequelize (null/default/automático)
    });

    // 5. Enviar a resposta de sucesso
    // Não enviamos a senha de volta!
    res.status(201).json({
      message: 'Usuário registrado com sucesso!',
      usuario: {
        id_usuario: novoUsuario.id_usuario,
        nome: novoUsuario.nome,
        email: novoUsuario.email
      }
    });

  } catch (error) {
    console.error('Erro no registro:', error);
    res.status(500).json({ message: 'Erro interno no servidor.', error: error.message });
  }
};

// --- FUNÇÃO DE LOGIN ---
exports.login = async (req, res) => {
  try {
    // 1. Pegar email e senha do body
    const { email, senha } = req.body;

    // 2. Encontrar o usuário pelo email
    const usuario = await Usuario.findOne({ where: { email: email } });
    if (!usuario) {
      return res.status(401).json({ message: 'Autenticação falhou. Usuário não encontrado.' });
    }

    // 3. Comparar a senha enviada com o hash salvo no banco
    const senhaValida = await bcrypt.compare(senha, usuario.senha_hash);
    if (!senhaValida) {
      return res.status(401).json({ message: 'Autenticação falhou. Senha incorreta.' });
    }

    // 4. Se a senha for válida, criar um Token JWT
    const token = jwt.sign(
      { 
        id_usuario: usuario.id_usuario, // Informação que guardamos no token
        email: usuario.email,
        is_admin: usuario.is_admin
      },
      JWT_SECRET, // O segredo para assinar o token
      { 
        expiresIn: '24h' // Token expira em 24 horas
      }
    );

    // 5. Enviar o token e os dados do usuário
    res.status(200).json({
      message: 'Login bem-sucedido!',
      token: token,
      usuario: {
        id_usuario: usuario.id_usuario,
        nome: usuario.nome,
        email: usuario.email,
        is_admin: usuario.is_admin
      }
    });

  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ message: 'Erro interno no servidor.', error: error.message });
  }
};