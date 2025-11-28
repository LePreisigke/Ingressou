// controllers/adminController.js

const db = require('../models');
const Ingresso = db.Ingresso;
const Usuario = db.Usuario;
const Jogo = db.Jogo;
const Setor = db.Setor;
const Estadio = db.Estadio;
const { Op } = require('sequelize');

exports.getDashboardStats = async (req, res) => {
  try {
    // 1. Contagens Simples (Cards do topo)
    const totalUsuarios = await Usuario.count();
    const totalJogos = await Jogo.count();
    const totalEstadios = await Estadio.count();
    const totalIngressos = await Ingresso.count();

    // 2. Calcular Faturamento Total
    // Soma o preço do setor de todos os ingressos vendidos
    const ingressosVendidos = await Ingresso.findAll({
      include: [{
        model: Setor,
        as: 'setor',
        attributes: ['preco']
      }]
    });

    const faturamentoTotal = ingressosVendidos.reduce((acc, ingresso) => {
      // Garante que é número
      return acc + Number(ingresso.setor?.preco || 0);
    }, 0);

    // 3. Dados para o Gráfico (Vendas por Estádio)
    // Busca todos os ingressos e agrupa pelo nome do estádio
    const ingressosPorEstadio = await Ingresso.findAll({
      include: [{
        model: Jogo,
        as: 'jogo',
        include: [{
          model: Estadio,
          as: 'estadio',
          attributes: ['nome']
        }]
      }]
    });

    const statsEstadio = {};
    ingressosPorEstadio.forEach(ing => {
      const nomeEstadio = ing.jogo?.estadio?.nome || 'Desconhecido';
      if (statsEstadio[nomeEstadio]) {
        statsEstadio[nomeEstadio]++;
      } else {
        statsEstadio[nomeEstadio] = 1;
      }
    });

    // Formata para o Recharts (array de objetos: { name, vendas })
    const graficoEstadios = Object.keys(statsEstadio).map(nome => ({
      name: nome,
      vendas: statsEstadio[nome]
    }));

    res.status(200).json({
      totalUsuarios,
      totalJogos,
      totalEstadios,
      totalIngressos,
      faturamentoTotal,
      graficoEstadios
    });

  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    res.status(500).json({ message: 'Erro interno ao gerar dashboard.' });
  }
};