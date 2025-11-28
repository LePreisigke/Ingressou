// src/pages/Tickets.jsx
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link, useSearchParams } from 'react-router-dom';
import { colors } from '../styles/GlobalStyles';
import SearchIconSvg from "../assets/Ativo1.svg";
import axios from 'axios';

// --- (getAsset - mantido) ---
const assetMap = import.meta.glob('../assets/*.{png,jpg,jpeg,svg,webp}', {
  eager: true,
  import: 'default',
});
const getAsset = (fileName) => {
  if (!fileName) return '';
  const keys = [
    `../assets/${fileName}`,
    `../assets/${fileName}.png`,
    `../assets/${fileName}.jpg`,
    `../assets/${fileName}.jpeg`,
    `../assets/${fileName}.svg`,
  ];
  for (const k of keys) {
    if (assetMap[k]) return assetMap[k];
  }
  return '';
};

// --- (Helpers de Formatação - mantidos) ---
const formatDate = (dateString) => {
  try {
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  } catch (e) { return dateString; }
};
const formatTime = (timeString) => {
  try {
    return timeString.substring(0, 5);
  } catch (e) { return timeString; }
};
const TEAM_LOGO = {
  'Corinthians': 'Corinthians.png',
  'São Paulo': 'São Paulo.png',
  'Flamengo': 'Flamengo.png',
  'Vasco': 'Vasco.png',
  'Botafogo': 'Botafogo.png',
  'River Plate': 'RiverPlate.png',
  'Palmeiras': 'Palmeiras.png',
  'Fluminense': 'Fluminense.png',
  'Santos' : 'Santos.png',
  'Ceará' : 'Ceará.png'
};

// --- (Styled Components - mantidos) ---
const TicketsContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const HeroTicketsSection = styled.section`
  width: 100%;
  background-color: ${colors.primaryDark};
  padding: 80px 5%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: ${colors.white};
  text-align: center;
`;
const HeroTitle = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 40px;
  max-width: 800px;
  font-weight: 700;
`;
const SearchInputContainer = styled.div`
  display: flex;
  align-items: center;
  background-color: ${colors.white};
  border-radius: 50px;
  padding: 5px 20px;
  width: 500px;
  max-width: 90%;
  border: 2px solid ${colors.purpleLight};
`;
const SearchInput = styled.input`
  flex: 1;
  border: none;
  outline: none;
  padding: 10px 0;
  font-size: 1rem;
  color: ${colors.textDark};
`;
const SearchIcon = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  img {
    width: 22px;
    height: 22px;
    transition: transform 0.2s ease;
    &:hover { transform: scale(1.1); }
  }
`;
const GamesSection = styled.section`
  width: 100%;
  padding: 50px 5%;
  background-color: ${colors.white};
  display: flex;
  justify-content: center;
`;
const GamesGrid = styled.div`
  width: 100%;
  max-width: 1200px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 30px;
`;
const GameCard = styled.div`
  display: flex;
  flex-direction: column;
  background-color: ${colors.primaryDark};
  color: ${colors.white};
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
`;
const MatchupHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;
const TeamBlock = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 90px;
  text-align: center;
  gap: 4px;
`;
const TeamLogo = styled.img`
  width: 70px;
  height: 70px;
  object-fit: contain;
`;
const TeamName = styled.span`
  font-size: 0.9rem;
`;
const VsText = styled.span`
  font-size: 1.8rem;
  font-weight: 700;
  color: ${colors.purpleLighter};
`;
const GameDetails = styled.div`
  font-size: 0.9rem;
  line-height: 1.6;
  border-top: 1px solid ${colors.purpleMedium};
  padding-top: 15px;
  span {
    display: block;
    margin-bottom: 3px;
  }
`;
const GameCategory = styled.span`
  display: flex;
  align-items: center;
  font-size: 1rem;
  font-weight: 600;
  margin-top: 10px;
  &::before {
    content: '•';
    color: ${colors.purpleLighter};
    font-size: 2rem;
    margin-right: 5px;
    line-height: 0;
  }
`;
const BuyButton = styled(Link)`
  background-color: ${colors.white};
  color: ${colors.primaryDark};
  border: none;
  padding: 10px 25px;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin-top: 20px;
  align-self: flex-start;
  
  &:hover {
    background-color: ${colors.purpleLight};
  }
`;

// --- (Componente TicketCard - mantido) ---
const TicketCard = ({
  id,
  teamA, teamB,
  logoA, logoB,
  round, date, stadium, time, category
}) => {
  const gameState = {
    id,
    matchup: `${teamA} x ${teamB}`,
    round,
    date,
    time,
    stadium,
    category,
  };

  return (
    <GameCard>
      <MatchupHeader>
        <TeamBlock>
          <TeamLogo
            src={getAsset(logoA)}
            alt={`${teamA} Logo`}
            onError={(e) => (e.currentTarget.style.visibility = 'hidden')}
          />
          <TeamName>{teamA}</TeamName>
        </TeamBlock>
        <VsText>X</VsText>
        <TeamBlock>
          <TeamLogo
            src={getAsset(logoB)}
            alt={`${teamB} Logo`}
            onError={(e) => (e.currentTarget.style.visibility = 'hidden')}
          />
          <TeamName>{teamB}</TeamName>
        </TeamBlock>
      </MatchupHeader>
      
      <GameDetails>
        <span>{round}</span>
        <span>Data: {date}</span>
        <span>Horário: {time}</span>
        <span>Estádio: {stadium}</span>
      </GameDetails>
      
      <GameCategory>{category}</GameCategory>

      <BuyButton
        to={`/ingressos/comprar/${id}`}
        state={{ game: gameState }}
      >
        Comprar Ingresso
      </BuyButton>
    </GameCard>
  );
};

// --- Página ---
const Tickets = () => {
  const [searchParams] = useSearchParams();
  const estadioSlug = searchParams.get('estadio');

  const [games, setGames] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pageTitle, setPageTitle] = useState("Carregando ingressos...");
  const [searchTerm, setSearchTerm] = useState('');

  // --- useEffect (Corrigido) ---
  useEffect(() => {
    // 1. Título Inicial (enquanto carrega)
    if (estadioSlug) {
      const formattedSlug = estadioSlug
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      setPageTitle(`Carregando jogos em: ${formattedSlug}`);
    } else {
      setPageTitle("Todos os Ingressos");
    }

    const fetchAllGames = async () => {
      try {
        setIsLoading(true);
        
        const params = new URLSearchParams();
        if (estadioSlug) {
          params.append('estadio', estadioSlug);
        }
        if (searchTerm) {
          params.append('q', searchTerm);
        }
        
        const apiUrl = 'http://localhost:8080/api/jogos';
        const response = await axios.get(apiUrl, { params: params });
        
        const formattedGames = response.data.map(game => ({
          id: game.id,
          teamA: game.time_casa,
          teamB: game.time_visitante,
          logoA: TEAM_LOGO[game.time_casa] || '',
          logoB: TEAM_LOGO[game.time_visitante] || '',
          round: `Rodada ${game.round}`,
          date: formatDate(game.data_jogo),
          stadium: game.estadio.nome,
          time: formatTime(game.horario),
          category: game.category
        }));
        
        setGames(formattedGames);
        setError(null);

        // --- MUDANÇA: Lógica do título (Definitiva) ---
        // SÓ altera o título se houver um FILTRO de estádio
        if (estadioSlug) {
          if (formattedGames.length > 0) {
            // Se tem jogos e filtro, pega o nome real do estádio
            setPageTitle(`Jogos em: ${formattedGames[0].stadium}`);
          } else {
            // Se tem filtro mas não tem jogos, usa o slug formatado
            const formattedSlug = estadioSlug
              .split('-')
              .map(word => word.charAt(0).toUpperCase() + word.slice(1))
              .join(' ');
            setPageTitle(`Jogos em: ${formattedSlug}`);
          }
        } else {
          // Se NÃO tem filtro (tela geral), o título é SEMPRE fixo
          // Isso impede que a pesquisa altere o título
          setPageTitle("Todos os Ingressos");
        }
        // --- FIM DA MUDANÇA ---
        
      } catch (err) {
        console.error("Erro ao buscar jogos:", err);
        setError("Não foi possível carregar os jogos. Tente novamente.");
        setPageTitle("Erro ao carregar jogos"); 
      } finally {
        setIsLoading(false);
      }
    };
    
    const timer = setTimeout(() => {
      fetchAllGames();
    }, 300);

    return () => clearTimeout(timer);
    
  }, [estadioSlug, searchTerm]);

  return (
    <TicketsContainer>
      <HeroTicketsSection>
        <HeroTitle>{pageTitle}</HeroTitle>
        <SearchInputContainer>
          <SearchInput 
            placeholder="Pesquise por time ou campeonato..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)} 
          />
          <SearchIcon>
            <img src={SearchIconSvg} alt="Pesquisar" />
          </SearchIcon>
        </SearchInputContainer>
      </HeroTicketsSection>

      <GamesSection>
        <GamesGrid>
          {isLoading && <p>Carregando jogos...</p>}
          
          {error && <p style={{color: 'red'}}>{error}</p>}
          
          {!isLoading && !error && (
            (games.length > 0 ? (
              games.map((game) => (
                <TicketCard key={game.id} {...game} />
              ))
            ) : (
              <p>Nenhum jogo encontrado {estadioSlug ? 'para este estádio' : ''}.</p>
            ))
          )}
        </GamesGrid>
      </GamesSection>
    </TicketsContainer>
  );
};

export default Tickets;