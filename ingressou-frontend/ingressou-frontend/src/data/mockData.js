// Dados Mockados para o Projeto Ingressou

// 1. Dados dos Estádios (incluindo mapas e setores)

export const STADIUM_DATA = {
    // Neo Química Arena (Jogo 1: Corinthians x São Paulo)
    1: {
        name: "Neo Química Arena",
        matchup: "Corinthians X São Paulo",
        date: "25 de Setembro, 19 horas",
        mapImage: "/src/assets/NeoQuimicaArena_Map.png", // Será movido
        sectors: [
            { id: 'Norte', name: 'Norte', price: 60.00, color: 'N4 Norte', description: 'Arquibancada tradicional (torcida popular)', capacity: 7800 },
            { id: 'OesteSuperior', name: 'Oeste Superior', price: 100.00, color: 'N9 Oeste Superior', description: 'Vista superior com boa visibilidade do campo', capacity: 10000 },
            { id: 'Business', name: 'Business', price: 250.00, color: 'N8 Business', description: 'Assento confortável com serviços exclusivos', capacity: 2500 },
            { id: 'Camarotes', name: 'Camarotes', price: 400.00, color: 'N5/N6 Camarotes', description: 'Área VIP com serviços e alimentação inclusa', capacity: 2500 },
            { id: 'OesteCentral', name: 'Oeste Central', price: 150.00, color: 'N4 Oeste Central', description: 'Arquibancada lateral, boa visão central', capacity: 10000 },
            { id: 'LesteInferior', name: 'Leste Inferior', price: 150.00, color: 'N4 Leste Inferior Lateral', description: 'Lateral inferior, visão intermediária', capacity: 10000 },
            { id: 'LesteSuperior', name: 'Leste Superior', price: 100.00, color: 'N6 Leste Superior Lateral', description: 'Arquibancada alta, visão lateral', capacity: 7500 },
            { id: 'SulVisitante', name: 'Sul Visitante', price: 80.00, color: 'N4 Sul Visitante', description: 'Setor reservado à torcida visitante', capacity: 6900 },
        ]
    },
    // Maracanã (Jogo 2: Flamengo X River Plate)
    2: {
        name: "Maracanã",
        matchup: "Flamengo X River Plate",
        date: "01 de Outubro, 19 horas",
        mapImage: "/src/assets/Maracana_Map.png", // Será movido
        sectors: [
            { id: 'Norte', name: 'Setor Norte', price: 120.00, color: 'Verde', description: 'Arquibancada tradicional, torcida popular do Flamengo', capacity: 15000 },
            { id: 'Sul', name: 'Setor Sul', price: 150.00, color: 'Amarelo', description: 'Arquibancada oposta, boa visão do campo, torcida mista', capacity: 15000 },
            { id: 'LesteInferior', name: 'Setor Leste Inferior', price: 220.00, color: 'Vermelho claro', description: 'Mais próxima do campo, visão lateral privilegiada', capacity: 10000 },
            { id: 'OesteSuperior', name: 'Setor Oeste Superior', price: 220.00, color: 'Azul escuro', description: 'Arquibancada superior, boa visão geral', capacity: 10000 },
            { id: 'CadeirasCativas', name: 'Cadeiras Cativas', price: 300.00, color: 'Azul claro', description: 'Assentos fixos com ótima visibilidade e conforto', capacity: 5000 },
            { id: 'CamarotesMaracanaMais', name: 'Camarotes (Maracanã Mais)', price: 600.00, color: 'Cinza', description: 'Área VIP com serviços, alimentação e estacionamento', capacity: 2000 },
            { id: 'SulVisitante', name: 'Setor Visitante (Sul Inferior)', price: 150.00, color: 'Amarelo claro', description: 'Área destinada à torcida do River Plate', capacity: 5000 },
        ]
    },
    // São Januário (Jogo 3: Vasco X Botafogo)
    3: {
        name: "São Januário",
        matchup: "Vasco X Botafogo",
        date: "09 de Outubro, 20:30 horas",
        mapImage: "/src/assets/SaoJanuario_Map.png", // Será movido
        sectors: [
            { id: 'NaoSocios', name: 'Área de não-sócios', price: 80.00, color: 'Bege', description: 'Arquibancada comum, público geral', capacity: 10000 },
            { id: 'Socios', name: 'Área de sócios', price: 50.00, color: 'Azul claro', description: 'Setor exclusivo para associados, assentos marcados', capacity: 5000 },
            { id: 'Visitante', name: 'Torcida visitante', price: 70.00, color: 'Cinza', description: 'Setor destinado à torcida do Botafogo', capacity: 3000 },
            { id: 'VIP', name: 'Área VIP', price: 150.00, color: 'Amarelo', description: 'Conforto, melhor visão e acesso a bar exclusivo', capacity: 2000 },
            { id: 'Camarotes', name: 'Camarotes', price: 250.00, color: 'Azul escuro', description: 'Área premium com serviço incluso e estacionamento', capacity: 1000 },
            { id: 'Tribuna', name: 'Tribuna de Honra', price: 400.00, color: 'Laranja', description: 'Setor nobre reservado a convidados e diretoria', capacity: 500 },
        ]
    }
};

// 2. Dados dos Jogos (reutilizados da Home/Tickets)
export const GAMES_DATA = [
    { id: 1, round: "Rodada 17", date: "25/09/2025", stadium: "Neo Química Arena", time: "18:30", category: "Brasileirão", matchup: "Corinthians X São Paulo", logoA: '/src/assets/logo_corinthians.png', logoB: '/src/assets/logo_saopaulo.png' },
    { id: 2, round: "Semi Final", date: "01/10/2025", stadium: "Maracanã", time: "19:00", category: "Libertadores", matchup: "Flamengo X River Plate", logoA: '/src/assets/logo_flamengo.png', logoB: '/src/assets/logo_riverplate.png' },
    { id: 3, round: "Quartas de final", date: "09/10/2025", stadium: "São Januário", time: "20:30", category: "Copa do Brasil", matchup: "Vasco X Botafogo", logoA: '/src/assets/logo_vasco.png', logoB: '/src/assets/logo_botafogo.png' },
    { id: 4, round: "Rodada 18", date: "28/09/2025", stadium: "Allianz Parque", time: "16:00", category: "Brasileirão", matchup: "Palmeiras X Fluminense" },
    { id: 5, round: "Oitavas", date: "05/10/2025", stadium: "Morumbi", time: "21:30", category: "Libertadores", matchup: "São Paulo X Boca Juniors" },
    { id: 6, round: "Final", date: "15/10/2025", stadium: "Mineirão", time: "17:00", category: "Estaduais", matchup: "Cruzeiro X Atlético-MG" },
];

// Função auxiliar para buscar dados do jogo e estádio
export const getGameData = (gameId) => {
    const id = parseInt(gameId, 10);
    const game = GAMES_DATA.find(g => g.id === id);
    const stadium = STADIUM_DATA[id]; // Assumindo que o ID do jogo corresponde ao ID do estádio para os 3 jogos iniciais
    
    // Para os jogos que não estão nos 3 iniciais, retorna dados mockados
    if (!game || !stadium) {
        return {
            game: { round: "Partida Não Encontrada", matchup: "Time A X Time B", date: "Data Desconhecida", stadium: "Estádio Padrão" },
            stadium: STADIUM_DATA[1] // Retorna Neo Química como fallback
        };
    }

    return { game, stadium };
};
