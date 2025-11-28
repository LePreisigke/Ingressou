// controllers/perfilController.js

const db = require('../models'); // Importa o 'models/index.js'
const Usuario = db.Usuario;
const bcrypt = require('bcryptjs');

// --- FUNÇÃO 1: Buscar dados do perfil (Correta) ---
// Rota: GET /api/perfil
exports.getPerfil = async (req, res) => {
  try {
    const id_usuario = req.user.id_usuario;

    const usuario = await Usuario.findByPk(id_usuario, {
      attributes: { exclude: ['senha_hash'] },
      include: [
        {
          model: db.UsuarioTimeFavorito,
          as: 'timesFavoritos',
          attributes: ['nome_time'] 
        },
        {
          model: db.Estadio,
          as: 'estadiosFavoritos',
          attributes: ['id_estadio', 'nome'] 
        },
        {
          model: db.Quiosque,
          as: 'quiosquesFavoritos',
          attributes: ['id_quiosque', 'nome_quiosque'] 
        }
      ]
    });

    if (!usuario) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    res.status(200).json(usuario);

  } catch (error) {
    console.error('Erro ao buscar perfil:', error);
    res.status(500).json({ message: 'Erro interno no servidor.' });
  }
};

// --- FUNÇÃO 2: Atualizar dados do perfil (Refatorada) ---
// Rota: PUT /api/perfil
exports.updatePerfil = async (req, res) => {
  // Inicia uma transação. Se algo falhar, tudo é revertido.
  const t = await db.sequelize.transaction(); 
  
  try {
    const id_usuario = req.user.id_usuario;

    // 1. Pega os campos simples e os arrays de favoritos
    const {
      nome,
      telefone,
      pais,
      cidade,
      cep,
      bairro,
      rua,
      numero,
      complemento,
      newPassword,
      
      // O frontend agora deve enviar ARRAYS
      timesFavoritos,     // Esperado: ["Corinthians", "Flamengo"]
      estadiosFavoritos,  // Esperado: [1, 3] (IDs dos estádios)
      quiosquesFavoritos  // Esperado: [2, 5] (IDs dos quiosques)

    } = req.body;

    // 2. Encontra o usuário (dentro da transação)
    const usuario = await Usuario.findByPk(id_usuario, { transaction: t });
    if (!usuario) {
      await t.rollback(); // Reverte a transação
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    // 3. Atualiza os campos simples
    if (nome) usuario.nome = nome;
    if (telefone) usuario.telefone = telefone;
    if (pais) usuario.pais = pais;
    if (cidade) usuario.cidade = cidade;
    if (cep) usuario.cep = cep;
    if (bairro) usuario.bairro = bairro;
    if (rua) usuario.rua = rua;
    if (numero) usuario.numero = numero;
    if (complemento !== undefined) usuario.complemento = complemento;

    // 4. Atualiza a senha (se enviada)
    if (newPassword && newPassword.trim() !== '') {
      if (newPassword.length < 6) {
         await t.rollback();
         return res.status(400).json({ message: 'A nova senha deve ter no mínimo 6 caracteres.' });
      }
      usuario.senha_hash = await bcrypt.hash(newPassword, 10);
    }

    // 5. Salva as mudanças simples
    await usuario.save({ transaction: t });

    // 6. ATUALIZA OS FAVORITOS (A MÁGICA ACONTECE AQUI)

    // A. Times Favoritos (1-para-N)
    if (timesFavoritos) {
      // 1. Remove todos os times antigos
      await db.UsuarioTimeFavorito.destroy({
        where: { id_usuario: id_usuario },
        transaction: t
      });
      // 2. Prepara os novos dados
      const novosTimes = timesFavoritos.map(nome => ({
        id_usuario: id_usuario,
        nome_time: nome
      }));
      // 3. Cria os novos
      await db.UsuarioTimeFavorito.bulkCreate(novosTimes, { transaction: t });
    }

    // B. Estádios e Quiosques (N-para-N)
    // O Sequelize torna isso MUITO fácil com os 'set' helpers
    // (O Sequelize entende 'setEstadiosFavoritos' por causa do 'as: estadiosFavoritos')

    if (estadiosFavoritos) {
      // O 'set' remove todos os antigos e adiciona todos os novos (baseado no array de IDs)
      await usuario.setEstadiosFavoritos(estadiosFavoritos, { transaction: t });
    }

    if (quiosquesFavoritos) {
      await usuario.setQuiosquesFavoritos(quiosquesFavoritos, { transaction: t });
    }

    // 7. Se tudo deu certo, 'commita' a transação
    await t.commit();

    // 8. Retorna o perfil completo e atualizado
    const perfilAtualizado = await Usuario.findByPk(id_usuario, {
      attributes: { exclude: ['senha_hash'] },
      include: [
        { model: db.UsuarioTimeFavorito, as: 'timesFavoritos', attributes: ['nome_time'] },
        { model: db.Estadio, as: 'estadiosFavoritos', attributes: ['id_estadio', 'nome'] },
        { model: db.Quiosque, as: 'quiosquesFavoritos', attributes: ['id_quiosque', 'nome_quiosque'] }
      ]
    });

    res.status(200).json({
        message: 'Perfil atualizado com sucesso!',
        usuario: perfilAtualizado
    });

  } catch (error) {
    // 9. Se algo falhou, reverte a transação
    await t.rollback();
    console.error('Erro ao atualizar perfil:', error);
    res.status(500).json({ message: 'Erro interno no servidor.' });
  }
};