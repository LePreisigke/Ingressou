import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { colors } from '../styles/GlobalStyles';
import { Link } from 'react-router-dom';
import BackgroundImage from '../assets/pasted_file_nOWs9O_image.png'; 
import SearchIconSvg from "../assets/Ativo1.svg";
import axios from 'axios';

// ===== util p/ logos em src/assets =====
const assetMap = import.meta.glob('../assets/*.{png,jpg,jpeg,svg,webp}', {
  eager: true,
  import: 'default',
});
const getAsset = (nameOrFile) => {
  if (!nameOrFile) return '';
  // Tenta encontrar o logo pelo nome (ex: "Corinthians" -> "Corinthians.png")
  const candidates = [
    `../assets/${nameOrFile}`,
    `../assets/${nameOrFile}.png`,
    `../assets/${nameOrFile}.jpg`,
    `../assets/${nameOrFile}.jpeg`,
    `../assets/${nameOrFile}.svg`,
    `../assets/${nameOrFile}.webp`,
  ];
  for (const key of candidates) {
    if (assetMap[key]) return assetMap[key];
  }
  return ''; // Retorna vazio se não achar
};

// Formata '2025-11-20' para '20/11/2025'
const formatDate = (dateString) => {
  try {
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  } catch (e) {
    return dateString; // Retorna original se falhar
  }
};
// Formata '16:00:00' para '16:00'
const formatTime = (timeString) => {
  try {
    return timeString.substring(0, 5); // Pega só HH:MM
  } catch (e) {
    return timeString;
  }
};



const HomeContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

// Seção Principal (Hero)
const HeroSection = styled.section`
  width: 100%;
  height: 70vh;
  background: url(${BackgroundImage}) no-repeat center center/cover;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: ${colors.white};
  text-align: center;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background-color: rgba(0, 0, 0, 0.4);
  }
`;

const HeroContent = styled.div`
  z-index: 10;
  padding: 20px;
`;

const HeroTitle = styled.h1`
  font-size: 3.5rem;
  margin-bottom: 20px;
  max-width: 800px;
  font-weight: 700;
`;

const BuyButton = styled(Link)`
  background-color: ${colors.purpleMedium};
  color: ${colors.white};
  border: none;
  padding: 15px 40px;
  font-size: 1.2rem;
  font-weight: 600;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: ${colors.primaryDark};
  }
`;

// Seção de Destaques (Jogos)
const HighlightsSection = styled.section`
  width: 100%;
  padding: 50px 0;
  background-color: ${colors.white};
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const SectionTitle = styled.h2`
  font-size: 2.5rem;
  color: ${colors.textDarker};
  margin-bottom: 30px;
`;

const GamesGrid = styled.div`
  width: 80%;
  max-width: 1200px;
  display: grid;
  grid-template-columns: 1fr;
  gap: 30px;
`;

const GameCard = styled.div`
  display: flex;
  background-color: ${colors.primaryDark};
  color: ${colors.white};
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
`;

const GameInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding-right: 20px;
  border-right: 1px solid ${colors.purpleMedium};
`;

const GameDetails = styled.div`
  font-size: 1.1rem;
  line-height: 1.8;

  span {
    display: block;
  }

  span:first-child {
    font-weight: bold;
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

const GameMatchup = styled.div`
  flex: 2;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding-left: 20px;
`;

const MatchTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 15px;
`;

const Teams = styled.div`
  display: flex;
  align-items: center;
  gap: 30px;
`;

const Team = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  
  img {
    width: 60px;
    height: 60px;
    object-fit: contain;
    margin-bottom: 5px;
  }
`;

const VsText = styled.span`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${colors.purpleLighter};
`;

const GameBuyButton = styled(BuyButton)`
  background-color: ${colors.white};
  color: ${colors.primaryDark};
  padding: 10px 25px;
  font-size: 1rem;
  margin-top: 15px;
  border-radius: 8px;
  &:hover {
    background-color: ${colors.purpleLight};
  }
`;

const MoreGamesButton = styled(BuyButton)`
  margin-top: 30px;
  background-color: ${colors.purpleMedium};
  color: ${colors.white};
`;

// Seção de Busca e Quiosques
const SearchKioskSection = styled.section`
  width: 100%;
  padding: 40px 0 50px;
  background-color: ${colors.offWhite};
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const SearchBox = styled.div`
  background-color: ${colors.primaryDark};
  color: ${colors.white};
  padding: 30px 400px;
  border-radius: 15px;
  text-align: center;
  margin-bottom: 50px;
`;

const SearchTitle = styled.h3`
  font-size: 1.8rem;
  margin-bottom: 5px;
`;

const SearchSubtitle = styled.p`
  font-size: 1rem;
  margin-bottom: 20px;
`;

const SearchInputContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: ${colors.white};
  border-radius: 50px;
  padding: 5px 15px;
  width: 400px;
  max-width: 90%;
  border: 2px solid ${colors.purpleLight};
`;

const SearchInput = styled.input`
  flex: 1;
  border: none;
  outline: none;
  padding: 10px;
  font-size: 1rem;
  color: ${colors.textDark};
  background: transparent;
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
  }

  &:hover img {
    transform: scale(1.1);
  }
`;

const KioskTitle = styled.h2`
  font-size: 2.5rem;
  color: ${colors.textDarker};
  margin-bottom: 10px;
`;

const KioskSubtitle = styled.p`
  margin-bottom: 20px;
  font-size: 1.2rem;
  color: ${colors.textDark};
`;

/* ========== Kiosks (cards) ========== */

const KiosksGrid = styled.div`
  width: 80%;
  max-width: 1200px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 30px;
  margin-top: 10px;
`;

const KioskCard = styled.div`
  background-color: ${colors.primaryDark};
  color: ${colors.white};
  border-radius: 20px;
  padding: 28px;
  box-shadow: 0 6px 18px rgba(0,0,0,0.2);
  
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 320px;            
`;

const KioskHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center; 
  margin-bottom: 10px; 
`;

const KioskName = styled.h3`
  font-size: 1.8rem;
  line-height: 1.1;
`;

const KioskLogo = styled.img`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: ${colors.white};
  padding: 6px;           
  object-fit: contain;  
  object-position: center;
  box-shadow: 0 0 0 2px rgba(255,255,255,0.15) inset;
`;

const KioskSlogan = styled.p`
  margin-top: 6px;
  font-style: italic;
  color: ${colors.purpleVeryLight};
  opacity: 0.9;
`;

const KioskRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin: 16px 0 10px;
`;

const KioskTag = styled.span`
  display: flex;
  align-items: center;
  font-weight: 600;
  &::before{
    content: '•';
    color: ${colors.purpleLighter};
    font-size: 1.6rem;
    margin-right: 6px;
    line-height: 0;
  }
`;

const KioskLocation = styled.span`
  color: ${colors.white};
  opacity: 0.9;
`;

const MenuButton = styled(Link)`
  display: block;                 
  width: fit-content;            
  margin: 16px auto 0;           
  background-color: ${colors.white};
  color: ${colors.primaryDark};
  padding: 12px 36px;
  border-radius: 20px;            
  font-weight: 700;
  text-align: center;
  transition: transform .15s ease, background-color .25s ease;

  &:hover{
    background-color: ${colors.purpleLighter};
    transform: translateY(-1px);
  }
`;

const KioskStadium = styled.div`
  text-align: center;
  margin-top: 10px;
  color: ${colors.purpleLighter};
  font-weight: 800;
  letter-spacing: .5px;
`;



// --- Componente Home ---
export default function Home() {
  // --- MUDANÇA: States da API para Jogos ---
  const [games, setGames] = useState([]);
  const [isLoadingGames, setIsLoadingGames] = useState(true);
  const [errorGames, setErrorGames] = useState(null);
  const [quiosques, setQuiosques] = useState([]);
  const [isLoadingQuiosques, setIsLoadingQuiosques] = useState(true);
  const [errorQuiosques, setErrorQuiosques] = useState(null);

  // --- MUDANÇA: useEffect para buscar Jogos ---
  useEffect(() => {
    const fetchData = async () => {
      // Busca Jogos
      try {
        setIsLoadingGames(true);
        const response = await axios.get('http://localhost:8080/api/jogos');
        setGames(response.data.slice(0, 3)); 
        setErrorGames(null);
      } catch (err) {
        setErrorGames('Erro ao buscar jogos.');
        console.error("Erro na API de Jogos:", err);
      } finally {
        setIsLoadingGames(false);
      }
      
      // Busca Quiosques
      try {
        setIsLoadingQuiosques(true);
        const response = await axios.get('http://localhost:8080/api/quiosques');
        // A API já formata os dados, então podemos usar direto
        setQuiosques(response.data); 
        setErrorQuiosques(null);
      } catch (err) {
        setErrorQuiosques('Erro ao buscar quiosques.');
        console.error("Erro na API de Quiosques:", err);
      } finally {
        setIsLoadingQuiosques(false);
      }
    };
    
    fetchData();
  }, []); // [] = roda só uma vez

  return (
    <HomeContainer>
      <HeroSection>
        <HeroContent>
          <HeroTitle>Escolha seu lugar, Viva a experiência completa</HeroTitle>
        </HeroContent>
      </HeroSection>

      {/* --- MUDANÇA: Seção de Jogos atualizada --- */}
      <HighlightsSection>
        <SectionTitle>Jogos destaques</SectionTitle>
        <GamesGrid>
          {/* Lógica de Loading / Erro */}
          {isLoadingGames && <p>Carregando jogos...</p>}
          {errorGames && <p style={{color: 'red'}}>{errorGames}</p>}

          {!isLoadingGames && !errorGames && (
            // Mapeia os dados da API
            games.map((g) => (
              <GameCard key={g.id}>
                <GameInfo>
                  <GameDetails>
                    {/* Formatamos os dados da API para o formato do frontend */}
                    <span>{g.round ? `Rodada ${g.round}` : 'Amistoso'}</span>
                    <span>Data: {formatDate(g.data_jogo)}</span>
                    <span>Estádio: {g.estadio.nome}</span>
                    <span>Horário: {formatTime(g.horario)}</span>
                  </GameDetails>
                  <GameCategory>{g.category}</GameCategory>
                </GameInfo>
                <GameMatchup>
                  <MatchTitle>{g.time_casa} X {g.time_visitante}</MatchTitle>
                  <Teams>
                    {/* Usamos o getAsset para encontrar o logo pelo nome do time */}
                    <Team><img src={getAsset(g.time_casa)} alt={g.time_casa} /></Team>
                    <VsText>X</VsText>
                    <Team><img src={getAsset(g.time_visitante)} alt={g.time_visitante} /></Team>
                  </Teams>
                  {/* O link agora usa o 'g.id' que veio da API */}
                  <GameBuyButton to={`/ingressos/comprar/${g.id}`}>Comprar Ingresso</GameBuyButton>
                </GameMatchup>
              </GameCard>
            ))
          )}
        </GamesGrid>
        <MoreGamesButton to="/ingressos">Ver mais jogos</MoreGamesButton>
      </HighlightsSection>

      <SearchKioskSection>
        {/* (Caixa de Busca - sem alterações) */}
        <SearchBox>
          <SearchTitle>Está a procura de algo?</SearchTitle>
          <SearchSubtitle>Encontre aqui:</SearchSubtitle>
          <SearchInputContainer>
            <SearchInput type="text" placeholder="Pesquisar por jogo, cidade..." />
            <SearchIcon>
              <img src={SearchIconSvg} alt="Pesquisar" />
            </SearchIcon>
          </SearchInputContainer>
        </SearchBox>

        <KioskTitle>Fome?</KioskTitle>
        <KioskSubtitle>Encontre o que você procura para a sua experiência no estádio.</KioskSubtitle>

        {/* (Grid de Quiosques - atualizado para usar a API) */}
        <KiosksGrid>
          {isLoadingQuiosques && <p>Carregando quiosques...</p>}
          {errorQuiosques && <p style={{color: 'red'}}>{errorQuiosques}</p>}
          
          {!isLoadingQuiosques && !errorQuiosques && (
            // MUDANÇA CRUCIAL: Usar 'quiosques' (do state) e não KIOSKS_HOME
            quiosques.map((k) => (
              <KioskCard key={k.id}>
                <KioskHeader>
                  <div>
                    <KioskName>{k.name}</KioskName>
                    <KioskSlogan>{k.slogan}</KioskSlogan>
                  </div>
                  {/* Usa a função getAsset com o 'k.logo' da API */}
                  {getAsset(k.logo) && (
                    <KioskLogo
                      src={getAsset(k.logo)}
                      alt={`${k.name} Logo`}
                      onError={(e) => (e.currentTarget.style.visibility = 'hidden')}
                    />
                  )}
                </KioskHeader>

                <KioskRow>
                  <KioskTag>{k.category}</KioskTag>
                  <KioskLocation>Localização: {k.location}</KioskLocation>
                </KioskRow>

                {/* O link deve usar k.id, que é o ID numérico do banco */}
                <MenuButton to={`/quiosques/cardapios/${k.id}`}>Cardápio</MenuButton>
                <KioskStadium>({k.stadiumShort})</KioskStadium>
              </KioskCard>
            ))
          )}
        </KiosksGrid>
      </SearchKioskSection>
    </HomeContainer>
  );
}
