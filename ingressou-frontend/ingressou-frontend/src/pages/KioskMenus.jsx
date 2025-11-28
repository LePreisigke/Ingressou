import React, { useState, useEffect } from 'react'; // <-- ATUALIZADO
import styled from "styled-components";
import { useParams, useNavigate } from "react-router-dom";
import { colors } from "../styles/GlobalStyles";
import axios from 'axios'; // <-- ADICIONADO

import McDonaldLogo from "../assets/quiosque_mcdonalds.jpg";
import OutbackLogo from "../assets/quiosque_outback.png";
import SantaForneriaLogo from "../assets/quiosque_santaforneria.jpg";

const imageMap = {
  'quiosque_mcdonalds.jpg': McDonaldLogo,
  'quiosque_outback.png': OutbackLogo,
  'quiosque_santaforneria.jpg': SantaForneriaLogo,
};


// ------------------ styled ------------------

const Page = styled.div`
  width: 100%;
  min-height: 100vh;
  background: ${colors.offWhite};
  padding: 30px 0 60px 0;
  display: flex;
  justify-content: center;
`;

const Content = styled.div`
  width: 100%;
  max-width: 1200px;
  padding: 0 20px;
`;

const BackButton = styled.button`
  background: ${colors.primaryDark};
  color: ${colors.white};
  border: none;
  padding: 8px 16px;
  border-radius: 999px;
  font-weight: 600;
  cursor: pointer;
  margin-bottom: 20px;

  &:hover {
    background: ${colors.purpleMedium};
  }
`;

const Header = styled.div`
  background: ${colors.primaryDark};
  color: ${colors.white};
  padding: 20px 25px;
  border-radius: 15px 15px 0 0;
  display: flex;
  gap: 15px;
  align-items: center;
`;

const Logo = styled.img`
  width: 70px;
  height: 70px;
  background: ${colors.white};
  border-radius: 16px;
  object-fit: contain;
  padding: 5px;
`;

const TitleBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const KioskName = styled.h1`
  font-size: 1.8rem;
`;

const KioskSlogan = styled.p`
  font-style: italic;
  color: ${colors.purpleVeryLight};
`;

const Body = styled.div`
  background: ${colors.white};
  border-radius: 0 0 15px 15px;
  box-shadow: 0 4px 25px rgba(0,0,0,.08);
  padding: 25px;
`;

const Contact = styled.div`
  margin-top: 25px;
  border-top: 1px solid ${colors.purpleVeryLight};
  padding-top: 16px;
  color: ${colors.textDark};
  font-size: .9rem;
`;

const MenuGroup = styled.div`
  margin-bottom: 25px;
`;

const GroupTitle = styled.h2`
  font-size: 1.1rem;
  color: ${colors.primaryDark};
  margin-bottom: 10px;
`;

const MenuRow = styled.div`
  display: flex;
  justify-content: space-between;
  border-bottom: 1px dashed ${colors.purpleVeryLight};
  padding: 6px 0;
  font-size: .95rem;
`;

const Price = styled.span`
  font-weight: 600;
  color: ${colors.primaryDark};
`;


const KioskMenu = () => {
  const { id } = useParams(); // Pega o ID do quiosque da URL
  const navigate = useNavigate();

  // --- MUDANÇA: States da API ---
  const [kiosk, setKiosk] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- MUDANÇA: useEffect para buscar dados ---
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        setIsLoading(true);
        // Chama a API com o ID da URL
        const response = await axios.get(`http://localhost:8080/api/cardapios/${id}`);
        
        // A API já envia os dados formatados (name, slogan, menu, etc.)
        setKiosk(response.data);
        setError(null);

      } catch (err) {
        console.error("Erro ao buscar cardápio:", err);
        setError("Quiosque não encontrado ou erro na API.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMenu();
  }, [id]); // Roda sempre que o ID na URL mudar

  // --- MUDANÇA: Lógica de Loading / Erro ---
  if (isLoading) {
    return (
      <Page>
        <Content>
          <BackButton onClick={() => navigate("/quiosques")}>← Voltar</BackButton>
          <p>Carregando cardápio...</p>
        </Content>
      </Page>
    );
  }

  if (error || !kiosk) {
    return (
      <Page>
        <Content>
          <BackButton onClick={() => navigate("/quiosques")}>← Voltar</BackButton>
          <p style={{color: 'red'}}>{error || "Quiosque não encontrado."}</p>
        </Content>
      </Page>
    );
  }

  // --- JSX Atualizado (usa 'kiosk' do state) ---
  return (
    <Page>
      <Content>
        <BackButton onClick={() => navigate("/quiosques")}>← Voltar</BackButton>

        <Header>
          {/* Usa o imageMap para o logo */}
          <Logo src={imageMap[kiosk.logo]} alt={kiosk.name} />
          <TitleBox>
            <KioskName>{kiosk.name}</KioskName>
            <KioskSlogan>"{kiosk.slogan}"</KioskSlogan>
            <span style={{ fontSize: "0.8rem" }}>📍 {kiosk.location}</span>
          </TitleBox>
        </Header>

        <Body>
          {Object.entries(kiosk.menu).map(([groupName, items]) => (
            <MenuGroup key={groupName}>
              <GroupTitle>{groupName}</GroupTitle>
              {items.map((item) => (
                <MenuRow key={item.item}>
                  <span>{item.item}</span>
                  <Price>{item.price}</Price>
                </MenuRow>
              ))}
            </MenuGroup>
          ))}

          <Contact>
            <p><strong>Telefone:</strong> {kiosk.phone}</p>
            <p><strong>E-mail:</strong> {kiosk.email}</p>
            <p style={{ fontSize: "0.75rem", marginTop: 6, color: colors.textLight }}>
              * Itens ilustrativos. Consulte no dia do evento.
            </p>
          </Contact>
        </Body>
      </Content>
    </Page>
  );
};

export default KioskMenu;
