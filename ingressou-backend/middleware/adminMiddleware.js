// middleware/adminMiddleware.js

exports.isAdmin = (req, res, next) => {
  // Este middleware assume que o 'authMiddleware.verifyToken' 
  // já rodou antes dele e preencheu o 'req.user'
  
  if (!req.user) {
    return res.status(401).json({ message: 'Não autorizado. Faça login.' });
  }

  // Verifica se a flag is_admin é verdadeira
  if (req.user.is_admin !== true) {
    return res.status(403).json({ message: 'Acesso negado. Apenas administradores.' });
  }

  // Se for admin, pode passar
  next();
};