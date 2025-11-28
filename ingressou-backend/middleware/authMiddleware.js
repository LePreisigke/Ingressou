// middleware/authMiddleware.js

const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'seu_segredo_super_secreto_local';

// Este é o nosso porteiro
exports.verifyToken = (req, res, next) => {
  // 1. Pega o token do cabeçalho 'Authorization'
  const authHeader = req.headers['authorization'];
  
  // O token vem no formato "Bearer [token]"
  // Pegamos apenas o [token]
  const token = authHeader && authHeader.split(' ')[1];

  // 2. Se não houver token, barra a entrada
  if (!token) {
    return res.status(403).json({ message: 'Acesso negado. Nenhum token fornecido.' });
  }

  try {
    // 3. Verifica se o token é válido
    const decoded = jwt.verify(token, JWT_SECRET);

    // 4. Se for válido, anexa os dados do usuário (ex: id_usuario) 
    // na requisição (req) para o controller poder usar
    req.user = decoded;
    
    // 5. Deixa a requisição passar para o próximo passo (o controller)
    next();

  } catch (error) {
    // 6. Se o token for inválido ou expirado, barra a entrada
    console.error('Token inválido:', error.message);
    return res.status(401).json({ message: 'Token inválido ou expirado.' });
  }
};