import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { colors } from '../styles/GlobalStyles';
import { Link } from 'react-router-dom';
import axios from 'axios'; 

// IMPORTANDO AS IMAGENS DO ASSETS
import Campnou from '../assets/Campnou.jpg';
import NeoquimicaImg from '../assets/Neoquimica.png';
import MaracanaImg from '../assets/Maracana.jpg';
import AllianzImg from '../assets/Allianzparque.jpg'; 
import VilaImg from '../assets/VilaBelmiro.jpg'

import SearchIconSvg from "../assets/Ativo1.svg";

const imageMap = {
  '/assets/Neoquimica.png': NeoquimicaImg,
  '/assets/Maracana.jpg': MaracanaImg,
  '/assets/Allianzparque.jpg': AllianzImg,
  '/assets/VilaBelmiro.jpg': VilaImg,
};

// --- Styled Components (COMPLETOS) ---

const StadiumsContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const HeroBanner = styled.section`
  width: 100%;
  height: 400px;
  background-color: #333;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  overflow: hidden;
`;

const HeroTitle = styled.h1`
  font-size: 5rem;
  color: ${colors.primaryDark};
  z-index: 10;
  text-shadow: 2px 2px 5px rgba(255, 255, 255, 0.8);
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const HeroImage = styled.img`
  position: absolute;
  width: 33.33%;
  height: 100%;
  object-fit: cover;
  opacity: 0.55;

  &:nth-child(1) {
    left: 0;
  }
  &:nth-child(2) {
    left: 33.33%;
  }
  &:nth-child(3) {
    left: 66.66%;
  }
`;

const SearchSection = styled.section`
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

const SearchTitle = styled.h2`
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

const SearchIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  img {
  width: 22px;
  height: 22px;
  transition: transform 0.2s ease;
&:hover {
  transform: scale(1.1);
}
  }
`;

const StadiumsGridSection = styled.section`
  width: 100%;
  padding: 50px 5%;
  background-color: ${colors.offWhite};
  display: flex;
  justify-content: center;
`;

const StadiumsGrid = styled.div`
  width: 100%;
  max-width: 1200px;
  display: grid;
  grid-template-columns: 1fr;
  gap: 50px;
`;

const StadiumCard = styled.div`
  display: flex;
  background-color: ${colors.white};
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  min-height: 400px;
`;

const StadiumImage = styled.div`
  flex: 1;
  background: url(${props => props.src}) no-repeat center center/cover;
`;

const StadiumDetails = styled.div`
  flex: 1;
  padding: 40px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const StadiumHeader = styled.div`
  margin-bottom: 20px;
`;

const StadiumName = styled.h3`
  font-size: 2.5rem;
  color: ${colors.textDarker};
  margin-bottom: 5px;
`;

const StadiumNickname = styled.p`
  font-size: 1.2rem;
  color: ${colors.purpleMedium};
  font-style: italic;
`;

const StadiumDescription = styled.p`
  font-size: 1rem;
  color: ${colors.textDark};
  line-height: 1.6;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 15px;
  margin-top: 30px;
  flex-wrap: wrap;
`;

const ActionButton = styled(Link)`
  background-color: ${colors.primaryDark};
  color: ${colors.white};
  border: none;
  padding: 10px 20px;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: ${colors.purpleMedium};
  }
`;

const StadiumCardComponent = ({ slug, name, nickname, description, imageUrl }) => {
  const imagemProcessada = imageMap[imageUrl] || null; 
  return (
    <StadiumCard>
      <StadiumImage src={imagemProcessada} />
      <StadiumDetails>
        <StadiumHeader>
          <StadiumName>{name}</StadiumName>
          <StadiumNickname>"{nickname}"</StadiumNickname>
          <StadiumDescription>{description}</StadiumDescription>
        </StadiumHeader>
        <ActionButtons>
          <ActionButton to={`/estadios/mapa/${slug}`}>Mapa do estádio</ActionButton>
          <ActionButton to={`/ingressos?estadio=${slug}`}>
            Jogos no estádio
          </ActionButton>
          <ActionButton to={`/quiosques?estadio=${slug}`}>
            Quiosques
          </ActionButton>
        </ActionButtons>
      </StadiumDetails>
    </StadiumCard>
  );
};

const Stadiums = () => {
  const [stadiums, setStadiums] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // --- MUDANÇA: State para a pesquisa ---
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchStadiums = async () => {
      try {
        setIsLoading(true);
        
        // --- MUDANÇA: Envia o termo de pesquisa 'q' ---
        const response = await axios.get('http://localhost:8080/api/estadios', {
          params: { q: searchTerm }
        });
        
        setStadiums(response.data);
        setError(null); 

      } catch (err) {
        // Salva a mensagem de erro no state
        setError('Erro ao buscar estádios. Tente novamente mais tarde.');
        console.error("Erro na API:", err);

      } finally {
        // Independente de sucesso ou erro, para de carregar
        setIsLoading(false);
      }
    };

    // --- MUDANÇA: Debounce (espera 300ms) ---
    const timer = setTimeout(() => {
      fetchStadiums();
    }, 300);

    return () => clearTimeout(timer);

  }, [searchTerm]); // Roda sempre que 'searchTerm' mudar

  return (
    <StadiumsContainer>
      <HeroBanner>
        <HeroImage src={Campnou} alt="Camp Nou" />
        <HeroImage src={NeoquimicaImg} alt="Neo Química Arena" />
        <HeroImage src={MaracanaImg} alt="Maracanã" />
        <HeroTitle>ESTÁDIOS</HeroTitle>
      </HeroBanner>
      <SearchSection>
        <SearchTitle>Seu lugar garantido, sua emoção completa.</SearchTitle>
        <SearchInputContainer>
          {/* --- MUDANÇA: Conecta o input ao state --- */}
          <SearchInput 
            placeholder="Pesquise aqui" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <SearchIcon>
            <img src={SearchIconSvg} alt="Pesquisar" />
            </SearchIcon>
        </SearchInputContainer>
      </SearchSection>
      <StadiumsGridSection>
        <StadiumsGrid>
          {isLoading && (
            <p style={{ textAlign: 'center', fontSize: '1.2rem' }}>
              Carregando estádios...
            </p>
          )}

          {error && (
            <p style={{ textAlign: 'center', fontSize: '1.2rem', color: 'red' }}>
              {error}
            </p>
          )}

          {!isLoading && !error && (
             stadiums.length > 0 ? (
                stadiums.map((stadium) => (
                  <StadiumCardComponent key={stadium.slug} {...stadium} />
                ))
             ) : (
                <p style={{textAlign: 'center', fontSize: '1.2rem'}}>Nenhum estádio encontrado.</p>
             )
          )}
        </StadiumsGrid>
      </StadiumsGridSection>
    </StadiumsContainer>
  );
};

export default Stadiums;