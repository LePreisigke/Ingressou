import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { colors } from '../styles/GlobalStyles';
import { Link, useSearchParams } from 'react-router-dom';
import axios from 'axios';
// --- MUDANÇA: Importar ícones de seta ---
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

// Importando as imagens dos quiosques
import McDonaldLogo from '../assets/quiosque_mcdonalds.jpg';
import OutbackLogo from '../assets/quiosque_outback.png';
import SantaForneriaLogo from '../assets/quiosque_santaforneria.jpg';

// Mapa de imagens
const imageMap = {
  'quiosque_mcdonalds.jpg': McDonaldLogo,
  'quiosque_outback.png': OutbackLogo,
  'quiosque_santaforneria.jpg': SantaForneriaLogo,
};

// --- Styled Components ---

const KiosksContainer = styled.div`
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 50px 20px;
`;

const HeaderSection = styled.div`
  text-align: center;
  margin-bottom: 40px;
`;

const MainTitle = styled.h1`
  font-size: 3rem;
  color: ${colors.primaryDark};
  margin-bottom: 10px;
`;

const SubTitle = styled.p`
  font-size: 1.2rem;
  color: ${colors.textDark};
`;

const PageLayout = styled.div`
  display: flex;
  gap: 40px;
  align-items: flex-start;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const FilterSidebar = styled.aside`
  width: 280px;
  background: ${colors.white};
  padding: 20px;
  border-radius: 15px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.05);
  flex-shrink: 0;
  
  @media (max-width: 768px) {
    width: 100%;
  }
`;

// --- MUDANÇA: Estilo do cabeçalho do filtro para parecer clicável ---
const FilterHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  padding-bottom: 10px;
  border-bottom: ${(props) => (props.isOpen ? `2px solid ${colors.purpleVeryLight}` : 'none')};
  margin-bottom: ${(props) => (props.isOpen ? '15px' : '0')};
  transition: all 0.3s ease;

  &:hover {
    opacity: 0.8;
  }
`;

const FilterTitle = styled.h3`
  font-size: 1.2rem;
  color: ${colors.primaryDark};
  margin: 0;
`;

// --- MUDANÇA: Animação simples para mostrar/esconder ---
const FilterListContainer = styled.div`
  display: ${(props) => (props.isOpen ? 'block' : 'none')};
`;

const FilterButton = styled.button`
  display: block;
  width: 100%;
  text-align: left;
  background: ${(props) => (props.active ? colors.purpleVeryLight : 'transparent')};
  color: ${(props) => (props.active ? colors.primaryDark : colors.textDark)};
  font-weight: ${(props) => (props.active ? '700' : '500')};
  border: none;
  padding: 12px 15px;
  border-radius: 8px;
  cursor: pointer;
  margin-bottom: 8px;
  transition: all 0.2s ease;
  border-left: 4px solid ${(props) => (props.active ? colors.primaryDark : 'transparent')};

  &:hover {
    background: ${colors.offWhite};
    color: ${colors.primaryDark};
  }
`;

const KiosksGrid = styled.div`
  flex: 1;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
`;

// --- Componentes do Card ---
const KioskCard = styled.div`
  background-color: ${colors.primaryDark};
  color: ${colors.white};
  padding: 20px;
  border-radius: 15px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 350px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
`;
const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 15px;
  gap: 15px;
`;
const KioskInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  h2 { font-size: 1.5rem; font-weight: 700; }
  p { font-style: italic; font-size: 0.9rem; color: ${colors.purpleLighter}; }
`;
const KioskLogo = styled.img`
  width: 65px;
  height: 65px;
  object-fit: contain;
  background-color: ${colors.white};
  border-radius: 50%;
  padding: 6px;
  flex-shrink: 0;
`;
const Location = styled.p`
  font-size: 0.85rem;
  color: ${colors.white};
  margin-top: 2px;
  text-align: left;
  font-style: normal;
`;
const Phone = styled.p`
  font-size: 0.8rem;
  color: ${colors.purpleVeryLight};
  text-align: left;
`;
const Email = styled.p`
  font-size: 0.8rem;
  color: ${colors.purpleVeryLight};
  text-align: left;
`;
const Category = styled.div`
  display: flex;
  align-items: center;
  font-size: 1rem;
  font-weight: 600;
  margin: 10px 0 15px 0;
  &::before {
    content: '•';
    color: ${colors.purpleLighter};
    font-size: 2rem;
    margin-right: 5px;
    line-height: 0;
  }
`;
const CardFooter = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
`;
const MenuButton = styled(Link)`
  background-color: ${colors.white};
  color: ${colors.primaryDark};
  border: none;
  padding: 12px 30px;
  font-size: 1.1rem;
  font-weight: 700;
  border-radius: 50px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  width: 80%;
  text-align: center;
  &:hover { background-color: ${colors.offWhite}; }
`;
const StadiumLabel = styled.span`
  font-size: 0.9rem;
  font-weight: 600;
  color: ${colors.purpleLight};
`;

// --- Componente do Card ---
const KioskCardComponent = ({
  id, name, slogan, location, stadiumShort,
  logo, category, phone, email,
}) => {
  const logoProcessado = imageMap[logo] || null;

  return (
    <KioskCard>
      <div>
        <CardHeader>
          <KioskInfo>
            <h2>{name}</h2>
            <p>"{slogan}"</p>
            <Location>Localização: {location}</Location>
            {phone && <Phone>📞 {phone}</Phone>}
            {email && <Email>📧 {email}</Email>}
          </KioskInfo>
          {logoProcessado && <KioskLogo src={logoProcessado} alt={`${name} Logo`} />}
        </CardHeader>
        <Category>{category}</Category>
      </div>
      <CardFooter>
        <MenuButton to={`/quiosques/cardapios/${id}`}>Cardápio</MenuButton>
        <StadiumLabel>{stadiumShort}</StadiumLabel>
      </CardFooter>
    </KioskCard>
  );
};

// --- Componente Principal ---
const Kiosks = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const estadioSlug = searchParams.get('estadio');

  const [kiosks, setKiosks] = useState([]);
  const [stadiumOptions, setStadiumOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [pageTitle, setPageTitle] = useState("Carregando quiosques...");

  // --- MUDANÇA: State para controlar se o filtro está aberto ou fechado ---
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // 1. Buscar lista de Estádios (para montar o filtro)
  useEffect(() => {
    const fetchStadiums = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/estadios');
        setStadiumOptions(response.data);
      } catch (err) {
        console.error("Erro ao carregar estádios para o filtro");
      }
    };
    fetchStadiums();
  }, []);

  // 2. Buscar Quiosques
  useEffect(() => {
    if (estadioSlug) {
      setPageTitle(`Carregando quiosques em: ${estadioSlug}`);
    } else {
      setPageTitle("Quiosques de Alimentação");
    }

    const fetchKiosks = async () => {
      try {
        setIsLoading(true);
        
        let apiUrl = 'http://localhost:8080/api/quiosques';
        if (estadioSlug) {
          apiUrl += `?estadio=${estadioSlug}`;
        }
        
        const response = await axios.get(apiUrl);
        setKiosks(response.data);
        setError(null);

        // Lógica do título
        if (response.data.length > 0) {
          if (estadioSlug) {
             setPageTitle(`Quiosques em: ${response.data[0].stadiumShort}`);
          } else {
             setPageTitle("Quiosques de Alimentação");
          }
        } else if (estadioSlug) {
          const formattedSlug = estadioSlug
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
          setPageTitle(`Quiosques em: ${formattedSlug}`);
        } else {
          setPageTitle("Quiosques de Alimentação");
        }

      } catch (err) {
        console.error("Erro ao buscar quiosques:", err);
        setError("Erro ao carregar quiosques. Tente novamente.");
        setPageTitle("Erro ao carregar quiosques");
      } finally {
        setIsLoading(false);
      }
    };

    fetchKiosks();
  }, [estadioSlug]);

  // Função para alterar o filtro
  const handleFilterChange = (slug) => {
    if (slug) {
      setSearchParams({ estadio: slug });
    } else {
      setSearchParams({});
    }
    // Opcional: Se quiser fechar o menu após clicar, descomente a linha abaixo:
    // setIsFilterOpen(false);
  };

  return (
    <KiosksContainer>
      <HeaderSection>
        <MainTitle>{pageTitle}</MainTitle>
        <SubTitle>Encontre o que você procura para a sua experiência no estádio.</SubTitle>
      </HeaderSection>

      <PageLayout>
        {/* --- SIDEBAR COM ACCORDION --- */}
        <FilterSidebar>
          {/* Cabeçalho clicável */}
          <FilterHeader onClick={() => setIsFilterOpen(!isFilterOpen)} isOpen={isFilterOpen}>
            <FilterTitle>Filtrar por Estádio</FilterTitle>
            {isFilterOpen ? <FaChevronUp color={colors.primaryDark} /> : <FaChevronDown color={colors.primaryDark} />}
          </FilterHeader>
          
          {/* Lista que abre e fecha */}
          <FilterListContainer isOpen={isFilterOpen}>
            <FilterButton 
              active={!estadioSlug} 
              onClick={() => handleFilterChange(null)}
            >
              🏟️ Todos os Estádios
            </FilterButton>

            {stadiumOptions.map((stadium) => (
              <FilterButton
                key={stadium.id_estadio}
                active={estadioSlug === stadium.slug}
                onClick={() => handleFilterChange(stadium.slug)}
              >
                📍 {stadium.name}
              </FilterButton>
            ))}
          </FilterListContainer>
        </FilterSidebar>

        <KiosksGrid>
          {isLoading && <p style={{gridColumn: '1/-1', textAlign: 'center'}}>Carregando...</p>}
          {error && <p style={{ color: 'red' }}>{error}</p>}

          {!isLoading && !error && (
            (kiosks.length > 0 ? (
              kiosks.map((kiosk) => (
                <KioskCardComponent key={kiosk.id} {...kiosk} />
              ))
            ) : (
              <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '40px' }}>
                <h3>Nenhum quiosque encontrado.</h3>
                <p>Tente selecionar outro estádio ou ver todos.</p>
              </div>
            ))
          )}
        </KiosksGrid>
      </PageLayout>
    </KiosksContainer>
  );
};

export default Kiosks;