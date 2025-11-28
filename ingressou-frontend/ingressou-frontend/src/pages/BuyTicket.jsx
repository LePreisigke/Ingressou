import React, { useState, useMemo, useEffect } from 'react';
import styled from 'styled-components';
import { colors } from '../styles/GlobalStyles';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios'; 

// --- Imports das imagens ---
import Maracana_Mapa from '../assets/Maracana_Entradas.jpg'; 
import NeoQuimica_Mapa from '../assets/NeoQuimica_MapaDetalhado.jpg';
import AllianzParque_Mapa from '../assets/AllianzParque_mapa.png'
import Vila_Mapa from '../assets/VilaBelmiro_mapa.jpg'

const imageMap = {
  '/assets/NeoQuimica_MapaDetalhado.jpg': NeoQuimica_Mapa,
  '/assets/Maracana_Entradas.jpg': Maracana_Mapa,
  '/assets/AllianzParque_mapa.png' : AllianzParque_Mapa,
  '/assets/VilaBelmiro_mapa.jpg' : Vila_Mapa
};

// --- Helpers ---
// (Mantidos iguais)
const TEAM_LOGO = {
  'Corinthians': 'Corinthians.png',
  'São Paulo': 'logo_saopaulo.png',
  'Flamengo': 'Flamengo.png',
  'Vasco': 'Vasco.png',
  'Botafogo': 'Botafogo.png',
  'River Plate': 'logo_riverplate.png',
  'Palmeiras': 'Palmeiras.png',
  'Fluminense': 'Fluminense.png'
};

function splitTeams(matchup = '') {
  const parts = matchup.split(/x|X|vs/).map((s) => s.trim()).filter(Boolean);
  if (parts.length >= 2) return [parts[0], parts[1]];
  return ['Time A', 'Time B'];
}

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
const formatPrice = (price) => `R$ ${Number(price).toFixed(2).replace('.', ',')}`;

const getSectorColor = (sectorName) => {
  const name = sectorName.toLowerCase();
  if (name.includes('norte')) return '#3498db'; 
  if (name.includes('sul')) return '#f1c40f'; 
  if (name.includes('leste')) return '#e67e22'; 
  if (name.includes('oeste')) return '#e74c3c'; 
  if (name.includes('mais')) return '#9b59b6'; 
  return '#95a5a6'; 
};

// --- Styled Components (MANTIDOS) ---
const BuyTicketContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 50px;
`;
const GameInfoSection = styled.section`
  width: 90%;
  max-width: 1200px;
  background-color: ${colors.primaryDark};
  color: ${colors.white};
  padding: 30px 40px;
  margin-top: 30px;
  border-radius: 10px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;
const GameDetails = styled.div`
  display: flex;
  flex-direction: column;
`;
const GameTitle = styled.h1`
  font-size: 2.2rem;
  font-weight: 700;
  margin-bottom: 5px;
`;
const Matchup = styled.h2`
  font-size: 1.5rem;
  font-weight: 400;
`;
const DateLocation = styled.div`
  text-align: right;
  font-size: 1rem;
  line-height: 1.5;
`;
const MainSection = styled.section`
  width: 90%;
  max-width: 1200px;
  display: flex;
  justify-content: space-between;
  margin-top: 40px;
  gap: 30px;
`;
const MapAndLegend = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const MapImage = styled.img`
  width: 100%;
  max-width: 400px;
  height: auto;
  margin-bottom: 20px;
`;
const LegendTable = styled.table`
  width: 100%;
  max-width: 400px;
  border-collapse: collapse;
  font-size: 0.9rem;
  td {
    padding: 5px 10px;
    border: 1px solid ${colors.purpleLight};
  }
  td:first-child {
    width: 20px;
  }
`;
const ColorIndicator = styled.div`
  width: 15px;
  height: 15px;
  background-color: ${(p) => p.color};
  border-radius: 3px;
`;
const SectorSelection = styled.div`
  flex: 2;
  display: flex;
  flex-direction: column;
`;
const SelectionBox = styled.div`
  background-color: ${colors.primaryDark};
  color: ${colors.white};
  padding: 30px;
  border-radius: 10px;
  text-align: center;
  margin-bottom: 30px;
`;
const SelectionTitle = styled.h3`
  font-size: 1.8rem;
  font-weight: 600;
`;
const SectorButtons = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 30px;
`;
const SectorButton = styled.button`
  background-color: ${(p) => (p.selected ? colors.primaryDark : colors.purpleVeryLight)};
  color: ${(p) => (p.selected ? colors.white : colors.primaryDark)};
  border: 2px solid ${colors.primaryDark};
  padding: 12px 20px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 1rem;
  font-weight: 600;
  &:hover {
    background-color: ${colors.purpleMedium};
    color: ${colors.white};
    border-color: ${colors.purpleMedium};
  }
`;
const TicketDetails = styled.div`
  background-color: ${colors.offWhite};
  padding: 30px;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
`;
const RulesContainer = styled.details`
  width: 100%;
  background-color: ${colors.offWhite}; 
  padding: 25px 30px;
  border-radius: 10px;
  margin-bottom: 30px; 
  border: 1px solid ${colors.purpleLight};
  color: ${colors.textDark};
`;
const RulesSummary = styled.summary`
  font-size: 1.1rem;
  font-weight: 700;
  color: ${colors.primaryDark};
  cursor: pointer;
  list-style: inside; 
  &:hover {
    color: ${colors.purpleMedium};
  }
`;
const RulesList = styled.ul`
  list-style: disc;
  padding-left: 30px; 
  margin-top: 15px;
  font-size: 0.95rem;
  line-height: 1.6;
  li {
    margin-bottom: 8px;
  }
`;
const DetailRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;
const SectorName = styled.h4`
  font-size: 1.5rem;
  color: ${colors.textDarker};
`;
const Price = styled.span`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${colors.primaryDark};
`;
const QuantityControl = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;
const QuantityLabel = styled.span`
  font-size: 1.2rem;
  color: ${colors.textDarker};
`;
const ControlButtons = styled.div`
  display: flex;
  background-color: ${colors.primaryDark};
  border-radius: 5px;
  overflow: hidden;
`;
const ControlButton = styled.button`
  background-color: ${colors.primaryDark};
  color: ${colors.white};
  border: none;
  padding: 10px 15px;
  font-size: 1.2rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
  &:hover {
    background-color: ${colors.purpleMedium};
  }
`;
const QuantityDisplay = styled.span`
  background-color: ${colors.white};
  color: ${colors.primaryDark};
  padding: 10px 15px;
  font-size: 1.2rem;
  font-weight: 600;
`;
const BuyFinalButton = styled(Link)`
  background-color: ${colors.primaryDark};
  color: ${colors.white};
  border: none;
  padding: 15px 30px;
  border-radius: 5px;
  font-size: 1.2rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease;
  &:hover {
    background-color: ${colors.purpleMedium};
  }
`;
const RegulationSection = styled.section`
  width: 90%;
  max-width: 1200px;
  margin-top: 50px;
  padding: 40px 0;
  border-top: 1px solid ${colors.purpleLight};
`;
const RegulationTitle = styled.h2`
  font-size: 2rem;
  color: ${colors.textDarker};
  margin-bottom: 30px;
`;
const RegulationList = styled.ul`
  list-style: none;
  padding: 0;
`;
const RegulationItem = styled.li`
  margin-bottom: 25px;
  h5 {
    font-size: 1.2rem;
    color: ${colors.primaryDark};
    margin-bottom: 5px;
  }
  ul {
    list-style: disc;
    margin-left: 20px;
    font-size: 1rem;
    color: ${colors.textDark};
  }
`;

// ---------------- Component ----------------
const BuyTicket = () => {
  const { id } = useParams(); 

  const [gameData, setGameData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedSector, setSelectedSector] = useState(null);
  const [quantity, setQuantity] = useState(1);
  
  useEffect(() => {
    const fetchGameDetails = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`http://localhost:8080/api/jogos/${id}`);
        setGameData(response.data);
        setError(null);
      } catch (err) {
        console.error("Erro ao buscar detalhes do jogo:", err);
        setError("Erro ao carregar dados do jogo. Tente novamente.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchGameDetails();
  }, [id]); 

  // --- MUDANÇA: Proteção contra estádios sem setores ---
  useEffect(() => {
    if (gameData && gameData.estadio && gameData.estadio.setores && gameData.estadio.setores.length > 0) {
      const defaultSector = gameData.estadio.setores[0];
      setSelectedSector({
        id: defaultSector.id_setor,
        name: defaultSector.nome_setor,
        price: parseFloat(defaultSector.preco),
      });
    } else {
      setSelectedSector(null); // Nenhum setor disponível
    }
  }, [gameData]); 
  

  const { game, stadium, sectors } = useMemo(() => {
    if (!gameData) return { game: {}, stadium: {}, sectors: [] };

    const g = gameData;
    const s = gameData.estadio;
    const setoresData = s.setores || []; // Garante que é um array

    return {
      game: {
        id: g.id_jogo,
        round: g.rodada ? `Rodada ${g.rodada}` : 'Amistoso',
        category: g.campeonato,
        matchup: `${g.time_casa} X ${g.time_visitante}`,
        date: formatDate(g.data_jogo),
        time: formatTime(g.horario),
        stadium: s.nome,
      },
      stadium: {
        name: s.nome,
        mapImage: imageMap[s.mapa_detalhado_url] || '', 
      },
      sectors: setoresData.map(sec => ({
        id: sec.id_setor,
        name: sec.nome_setor,
        price: parseFloat(sec.preco),
        capacity: sec.capacidade_setor,
        color: getSectorColor(sec.nome_setor)
      }))
    };
  }, [gameData]);

  const [teamA, teamB] = useMemo(() => splitTeams(game?.matchup || ''), [game?.matchup]);
  // Removido uso de TEAM_LOGO antigo

  const regrasDoEvento = [
    "É proibida a entrada com bebidas (exceto água em copo plástico).",
    "É proibida a entrada com camisas de times visitantes no setor da torcida local.",
    "Não é permitido o uso de fogos de artifício ou sinalizadores.",
    "Todos os participantes estarão sujeitos a uma revista na entrada.",
    "O ingresso é pessoal e intransferível."
  ];

  const handleQuantityChange = (change) => {
    setQuantity((prev) => Math.max(1, prev + change));
  };

  const totalPrice = selectedSector ? selectedSector.price * quantity : 0;

  if (isLoading) {
    return <BuyTicketContainer><p style={{marginTop: 50}}>Carregando jogo...</p></BuyTicketContainer>;
  }

  if (error) {
    return <BuyTicketContainer><p style={{marginTop: 50, color: 'red'}}>{error}</p></BuyTicketContainer>;
  }

  // Se não tiver dados de jogo, não mostra nada
  if (!gameData) return null;

  return (
    <BuyTicketContainer>
      <GameInfoSection>
        <GameDetails>
          <GameTitle>{game.round} - {game.category}</GameTitle>
          <Matchup>{game.matchup}</Matchup>
        </GameDetails>
        <DateLocation>
          <span>Data: {game.date} </span><br />
          <span>Estádio: {game.stadium} </span>
        </DateLocation>
      </GameInfoSection>

      <MainSection>
        <MapAndLegend>
          <MapImage src={stadium.mapImage} alt={`Mapa do Estádio ${stadium.name}`} />
          
          {/* --- MUDANÇA: Só mostra tabela se tiver setores --- */}
          {sectors.length > 0 && (
            <LegendTable>
              <tbody>
                <tr><td colSpan="3">LEGENDA</td></tr>
                {sectors.map((sector) => (
                  <tr key={sector.id}>
                    <td><ColorIndicator color={sector.color} /></td>
                    <td>{sector.name}</td>
                    <td>{sector.capacity ? sector.capacity.toLocaleString('pt-BR') : '-'}</td>
                  </tr>
                ))}
                <tr>
                  <td colSpan="2">TOTAL</td>
                  <td>
                    {sectors
                      .reduce((acc, s) => acc + (s.capacity || 0), 0)
                      .toLocaleString('pt-BR')}
                  </td>
                </tr>
              </tbody>
            </LegendTable>
          )}
        </MapAndLegend>

        <SectorSelection>
          <SelectionBox>
            <SelectionTitle>Escolha seu setor e viva o momento</SelectionTitle>
          </SelectionBox>

          {/* --- MUDANÇA: Verifica se tem setores --- */}
          {sectors.length > 0 ? (
            <>
              <SectorButtons>
                {sectors.map((sector) => ( 
                  <SectorButton
                    key={sector.id}
                    selected={selectedSector && sector.id === selectedSector.id}
                    onClick={() => setSelectedSector(sector)}
                  >
                    {sector.name}
                  </SectorButton>
                ))}
              </SectorButtons>

              <RulesContainer>
                <RulesSummary>⚠️ Regras Importantes do Evento</RulesSummary>
                <RulesList>
                  {regrasDoEvento.map((regra, index) => (
                    <li key={index}>{regra}</li>
                  ))}
                </RulesList>
              </RulesContainer>

              {/* Se tiver setor selecionado, mostra detalhes */}
              {selectedSector && (
                <TicketDetails>
                  <DetailRow>
                    <SectorName>{selectedSector.name.toUpperCase()} | TIME DA CASA</SectorName>
                    <Price>{formatPrice(totalPrice)}</Price>
                  </DetailRow>

                  <DetailRow>
                    <QuantityControl>
                      <QuantityLabel>Quantidade</QuantityLabel>
                      <ControlButtons>
                        <ControlButton type="button" onClick={() => handleQuantityChange(-1)}>-</ControlButton>
                        <QuantityDisplay>{quantity}</QuantityDisplay>
                        <ControlButton type="button" onClick={() => handleQuantityChange(1)}>+</ControlButton>
                      </ControlButtons>
                    </QuantityControl>

                    <BuyFinalButton
                      to="/carrinho"
                      state={{
                        item: {
                          id_jogo: gameData.id_jogo,
                          id_setor: selectedSector.id,
                          game: game.matchup,
                          category: game.category,
                          date: game.date,
                          time: game.time,
                          stadium: stadium.name,
                          sector: selectedSector.name,
                          unitPrice: selectedSector.price,
                          quantity,
                          total: totalPrice,
                          teamA,
                          teamB,
                        },
                      }}
                    >
                      COMPRAR
                    </BuyFinalButton>
                  </DetailRow>
                </TicketDetails>
              )}
            </>
          ) : (
            // --- MUDANÇA: Mensagem amigável se não houver setores ---
            <div style={{textAlign: 'center', padding: '40px', background: colors.white, borderRadius: '10px'}}>
              <h3>Ingressos Indisponíveis</h3>
              <p>Ainda não há setores cadastrados para este estádio.</p>
              <p>Por favor, tente outro jogo ou volte mais tarde.</p>
              <Link to="/ingressos" style={{color: colors.primaryDark, fontWeight: 'bold', marginTop: '20px', display: 'inline-block'}}>Voltar para lista de jogos</Link>
            </div>
          )}
        </SectorSelection>
      </MainSection>

      {/* --- (Regulamento mantido) --- */}
      <RegulationSection>
        <RegulationTitle>REGULAMENTO DO INGRESSOU:</RegulationTitle>
        <RegulationList>
             {/* ... Itens do regulamento ... */}
             <RegulationItem>
              <h5>Compra de Ingressos</h5>
              <ul>
                <li>Após a confirmação do pagamento, o ingresso digital será enviado para o e-mail cadastrado.</li>
                <li>A compra de ingressos é realizada exclusivamente pela plataforma Ingressou.</li>
              </ul>
            </RegulationItem>
             {/* ... Pode manter os outros itens ... */}
        </RegulationList>
      </RegulationSection>
    </BuyTicketContainer>
  );
};

export default BuyTicket;