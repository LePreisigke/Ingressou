import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { colors } from '../styles/GlobalStyles';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios'; 

// Importando as imagens
import Maracana_Rotas from '../assets/Maracana_Rotas.jpg';
import Maracana_Entradas from '../assets/Maracana_Entradas.jpg';
import NeoQuimica_Rotas from '../assets/NeoQuimica_Rotas.jpg';
import NeoQuimica_EntradaOeste from '../assets/NeoQuimica_EntradaOeste.jpg';
import NeoQuimica_EntradaSul from '../assets/NeoQuimica_EntradaSul.jpg';
import NeoQuimica_EntradaLeste from '../assets/NeoQuimica_EntradaLeste.jpg';
import NeoQuimica_EntradaNorte from '../assets/NeoQuimica_EntradaNorte.jpg';
import NeoQuimica_MapaDetalhado from '../assets/NeoQuimica_MapaDetalhado.jpg';

// --- MUDANÇA: Criamos o "mapa" de imagens ---
// Isso liga as strings da API às variáveis de imagem importadas
const imageMap = {
  '/assets/Maracana_Rotas.jpg': Maracana_Rotas,
  '/assets/Maracana_Entradas.jpg': Maracana_Entradas,
  '/assets/NeoQuimica_Rotas.jpg': NeoQuimica_Rotas,
  '/assets/NeoQuimica_EntradaOeste.jpg': NeoQuimica_EntradaOeste,
  '/assets/NeoQuimica_EntradaSul.jpg': NeoQuimica_EntradaSul,
  '/assets/NeoQuimica_EntradaLeste.jpg': NeoQuimica_EntradaLeste,
  '/assets/NeoQuimica_EntradaNorte.jpg': NeoQuimica_EntradaNorte,
  '/assets/NeoQuimica_MapaDetalhado.jpg': NeoQuimica_MapaDetalhado,
};


// -----------------------------------------------------------------------------
// 2. STYLED COMPONENTS
// -----------------------------------------------------------------------------
const PageWrapper = styled.div`
  position: relative;
`;

const BackButton = styled.button`
  position: absolute;
  top: 15px;
  left: 15px;
  background-color: ${colors.primaryDark};
  color: ${colors.white};
  border: none;
  padding: 10px 18px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  z-index: 20;
  &:hover {
    background-color: ${colors.purpleMedium};
  }
`;

const MapContainer = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 30px 20px;
`;

const HeaderSection = styled.header`
  background-color: ${colors.offWhite};
  padding: 30px;
  border-radius: 10px;
  margin-bottom: 30px;
`;

const StadiumName = styled.h1`
  font-size: 2.5rem;
  color: ${colors.primaryDark};
`;

const StadiumDescription = styled.p`
  margin-top: 10px;
  color: ${colors.textDark};
  line-height: 1.5;
`;

const TabsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 30px;
  border-bottom: 2px solid ${colors.purpleVeryLight};
`;

const TabButton = styled.button`
  flex: 1;
  background: none;
  border: none;
  padding: 15px 10px;
  font-size: 1.1rem;
  font-weight: 600;
  color: ${(props) => (props.active ? colors.primaryDark : colors.textDark)};
  border-bottom: 3px solid
    ${(props) => (props.active ? colors.purpleMedium : 'transparent')};
  cursor: pointer;
  transition: 0.3s;
  &:hover {
    color: ${colors.purpleMedium};
  }
`;

const ContentSection = styled.div`
  background-color: ${colors.white};
  border-radius: 10px;
  padding: 25px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
`;

const ContentTitle = styled.h2`
  font-size: 1.8rem;
  color: ${colors.textDarker};
  margin-bottom: 20px;
`;

const InfoList = styled.ul`
  list-style: none;
  padding: 0;
  li {
    margin-bottom: 10px;
    color: ${colors.textDark};
  }
`;

const ImageContent = styled.img`
  width: 80%;
  max-width: 900px;
  display: block;
  margin: 25px auto 0;
  border-radius: 8px;
`;

const EntrancesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
`;

const EntranceCard = styled.div`
  border: 1px solid ${colors.purpleVeryLight};
  border-radius: 8px;
  overflow: hidden;
`;

const EntranceTitle = styled.h3`
  background-color: ${colors.primaryDark};
  color: ${colors.white};
  padding: 10px;
  text-align: center;
`;

const EntranceImage = styled.img`
  width: 100%;
  height: auto;
`;

const EntranceInfo = styled.p`
  padding: 10px 15px 15px;
  font-size: 0.9rem;
  line-height: 1.4;
  color: ${colors.textDark};
`;

// -----------------------------------------------------------------------------
// 3. CONTEÚDO DAS ABAS
// -----------------------------------------------------------------------------
const TabContent = ({ activeTab, data }) => {
  // Neo Química?
  const isNeo = data.name === 'Neo Química Arena';
  const isMaracana = data.name === 'Maracanã';

  switch (activeTab) {
    case 'Informações':
      return (
        <ContentSection>
          <ContentTitle>Informações Gerais</ContentTitle>
          {/* --- MUDANÇA ---
            Adicionamos .filter() para remover a seção 'Como Chegar' desta aba
          */}
          {Object.entries(data.info)
            .filter(([sectionTitle, items]) => sectionTitle !== 'Como Chegar')
            .map(([sectionTitle, items]) => (
              <div key={sectionTitle} style={{ marginBottom: '20px' }}>
                <h3 style={{ color: colors.purpleMedium, marginBottom: 8 }}>
                  {sectionTitle}
                </h3>
                <InfoList>
                  {items.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </InfoList>
              </div>
            ))}
        </ContentSection>
      );

    case 'Rotas em Dia de Jogo':
      // Rota do Neo Química (sem alteração)
      if (isNeo) {
        return (
          <ContentSection>
            {/* (Todo o seu código de rotas do Neo Química fica aqui) */}
            <ContentTitle>Como Chegar</ContentTitle>
            <p>
              Veja abaixo a melhor opção para você chegar na Neo Química Arena...
            </p>
            {/* ...etc... */}
            <ImageContent
              src={data.routes}
              alt="Rotas da Neo Química Arena"
              style={{ width: '65%' }}
            />
          </ContentSection>
        );
      }

      {/* --- MUDANÇA ---
        Adicionamos este bloco 'if (isMaracana)'
      */}
      if (isMaracana && data.info['Como Chegar']) {
        return (
          <ContentSection>
            <ContentTitle>Como Chegar</ContentTitle>
            <p>
              O Estádio Jornalista Mário Filho, conhecido como Maracanã, 
              possui acesso facilitado por diversos meios de transporte.
            </p>

            {/* Renderiza a lista "Como Chegar" vinda da API */}
            <InfoList style={{ marginTop: '20px', listStyleType: 'none', paddingLeft: 0 }}>
              {data.info['Como Chegar'].map((item, idx) => (
                <li 
                  key={idx} 
                  style={{ fontSize: '1.1rem', marginBottom: '10px', color: colors.textDarker }}
                >
                  {item}
                </li>
              ))}
            </InfoList>
            
            <ImageContent 
              src={data.routes} 
              alt="Rotas do Maracanã" 
              style={{ marginTop: '20px' }}
            />
          </ContentSection>
        );
      }

      // outros estádios continuam mostrando a imagem simples
      return (
        <ContentSection>
          <ContentTitle>Rotas de Acesso</ContentTitle>
          <ImageContent src={data.routes} alt="Rotas do estádio" />
        </ContentSection>
      );

    case 'Entradas':
      if (isMaracana) {
        return (
          <ContentSection>
            <ContentTitle>Entradas do Maracanã</ContentTitle>
            <ImageContent
              src={data.entrances['Mapa de Entradas e Bilheterias']}
              alt="Entradas Maracanã"
            />
          </ContentSection>
        );
      }

      // Neo Química detalhado
      return (
        <ContentSection>
          <ContentTitle>Entradas da Neo Química Arena</ContentTitle>
          <EntrancesGrid>
            <EntranceCard>
              <EntranceTitle>Entrada Oeste</EntranceTitle>
              <EntranceImage src={data.entrances['Oeste']} alt="Entrada Oeste" />
              <EntranceInfo>
                <b>PORTÕES A e D:</b> acesso setor oeste inferior e Área VIP.<br />
                <b>PORTÃO B:</b> escada monumental para camarotes 501-546 e
                601-646, centro de convenções, Business Lounge e oeste superior.
              </EntranceInfo>
            </EntranceCard>

            <EntranceCard>
              <EntranceTitle>Entrada Leste</EntranceTitle>
              <EntranceImage src={data.entrances['Leste']} alt="Entrada Leste" />
              <EntranceInfo>
                <b>Portões H e N:</b> acesso setor leste inferior. <br />
                <b>Portões I, J, K, L, M:</b> acesso setor leste superior.
              </EntranceInfo>
            </EntranceCard>

            <EntranceCard>
              <EntranceTitle>Entrada Norte</EntranceTitle>
              <EntranceImage src={data.entrances['Norte']} alt="Entrada Norte" />
              <EntranceInfo>
                <b>Portões O, P, Q:</b> setor norte (torcidas organizadas
                cadastradas na FPF). Entrada principal hoje: portão O; saída:
                P e Q.
              </EntranceInfo>
            </EntranceCard>

            <EntranceCard>
              <EntranceTitle>Entrada Sul</EntranceTitle>
              <EntranceImage src={data.entrances['Sul']} alt="Entrada Sul" />
              <EntranceInfo>
                <b>Portões E, F:</b> setor sul. Hoje entra pelo E e sai pelo F.
              </EntranceInfo>
            </EntranceCard>
          </EntrancesGrid>
        </ContentSection>
      );

    case 'Mapa Detalhado':
      return (
        <ContentSection>
          <ContentTitle>Mapa Detalhado do Estádio</ContentTitle>
          {/* imagem um pouco menor */}
          <ImageContent
            src={data.detailedMap}
            alt="Mapa Detalhado"
            style={{ width: '75%' }}
          />
        </ContentSection>
      );

    default:
      return null;
  }
};

// -----------------------------------------------------------------------------
// 4. COMPONENTE PRINCIPAL
// -----------------------------------------------------------------------------
const StadiumMap = () => {
  const { stadiumSlug } = useParams();
  const navigate = useNavigate();

  // --- MUDANÇA: States para a API ---
  const [stadiumData, setStadiumData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [activeTab, setActiveTab] = useState('Informações');
  const tabs = ['Informações', 'Rotas em Dia de Jogo', 'Entradas', 'Mapa Detalhado'];

  // --- MUDANÇA: useEffect para buscar dados ---
  useEffect(() => {
    const fetchStadiumData = async () => {
      if (!stadiumSlug) return; // Não faz nada se não houver slug
      
      try {
        setIsLoading(true);
        const response = await axios.get(`http://localhost:8080/api/estadios/${stadiumSlug}`);
        
        // --- Processa os dados da API para usar o imageMap ---
        let data = response.data;
        
        // Processa 'routes' (string)
        if (data.routes && imageMap[data.routes]) {
          data.routes = imageMap[data.routes];
        }
        
        // Processa 'detailedMap' (string)
        if (data.detailedMap && imageMap[data.detailedMap]) {
          data.detailedMap = imageMap[data.detailedMap];
        }

        // Processa 'entrances' (objeto de strings)
        if (data.entrances) {
          const newEntrances = {};
          for (const key in data.entrances) {
            const path = data.entrances[key];
            newEntrances[key] = imageMap[path] || path; // Usa o map ou mantém a string
          }
          data.entrances = newEntrances;
        }

        setStadiumData(data);
        setError(null);

      } catch (err) {
        console.error("Erro ao buscar dados do estádio:", err);
        setError("Estádio não encontrado ou erro na API.");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchStadiumData();
  }, [stadiumSlug]); // Roda de novo se o slug na URL mudar


  // --- MUDANÇA: Lógica de Loading / Erro ---
  if (isLoading) {
    return (
      <PageWrapper>
        <MapContainer>
          <p style={{ textAlign: 'center', fontSize: '1.2rem', marginTop: '50px' }}>
            Carregando dados do estádio...
          </p>
        </MapContainer>
      </PageWrapper>
    );
  }

  if (error) {
     return (
      <PageWrapper>
        <BackButton onClick={() => navigate('/estadios')}>← Voltar</BackButton>
        <MapContainer>
          <p style={{ textAlign: 'center', fontSize: '1.2rem', color: 'red', marginTop: '50px' }}>
            {error}
          </p>
        </MapContainer>
      </PageWrapper>
    );
  }
  
  if (!stadiumData) {
    return null; // Não renderiza nada se não houver dados
  }

  // --- Renderização normal (agora usa stadiumData do state) ---
  return (
    <PageWrapper>
      <BackButton onClick={() => navigate('/estadios')}>
        ← Voltar
      </BackButton>

      <MapContainer>
        <HeaderSection>
          <StadiumName>{stadiumData.name}</StadiumName>
          <StadiumDescription>{stadiumData.description}</StadiumDescription>
        </HeaderSection>

        <TabsContainer>
          {tabs.map((tab) => (
            <TabButton
              key={tab}
              active={activeTab === tab}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </TabButton>
          ))}
        </TabsContainer>

        <TabContent activeTab={activeTab} data={stadiumData} />
      </MapContainer>
    </PageWrapper>
  );
};

export default StadiumMap;
