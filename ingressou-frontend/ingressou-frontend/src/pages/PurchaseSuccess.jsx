import React from 'react';
import styled from 'styled-components';
import { colors } from '../styles/GlobalStyles';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import { QRCodeSVG } from 'qrcode.react';

// resolve imagens por nome de arquivo vindo do state (logoA/logoB)
const assetMap = import.meta.glob('../assets/*.{png,jpg,jpeg,svg,webp}', {
  eager: true,
  import: 'default',
});
const getAsset = (nameOrFile) => {
  if (!nameOrFile) return '';
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
  return '';
};

// ---- styled (mesmos estilos que você já usa) ----
const PageWrapper = styled.div`
  width: 100%;
  min-height: 100vh;
  background: ${colors.offWhite};
  display: flex;
  justify-content: center;
  padding: 40px 15px 80px;
`;

const TicketCard = styled.div`
  width: 100%;
  max-width: 1180px;
  background: ${colors.white};
  border-radius: 25px;
  box-shadow: 0 15px 60px rgba(0, 0, 0, 0.07);
  padding: 35px 35px 45px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 35px;
`;

const Title = styled.h1`
  font-size: 2.4rem;
  color: ${colors.primaryDark};
  line-height: 1.1;
  span {
    display: block;
    font-size: 1.2rem;
    color: ${colors.textDark};
    margin-top: 8px;
  }
`;

const Badge = styled.div`
  background: #35c96b;
  color: #fff;
  font-size: 0.95rem;
  padding: 8px 20px;
  border-radius: 999px;
  font-weight: 600;
`;

const TicketAndActions = styled.div`
  display: flex;
  gap: 28px;
  flex-wrap: wrap;
`;

const TicketLeft = styled.div`
  background: ${colors.primaryDark};
  color: ${colors.white};
  width: 380px;
  border-radius: 20px;
  padding: 22px 22px 26px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const TeamsRow = styled.div`
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
  h4 {
    margin: 0;
    font-weight: 700;
  }
`;

const TeamLogo = styled.img`
  width: 48px;
  height: 48px;
  object-fit: contain;
  display: block;
  margin: 6px auto 0;
`;

const Vs = styled.div`
  font-weight: 800;
  font-size: 1.1rem;
  opacity: .9;
`;

const CompName = styled.div`
  text-align: center;
  margin: 6px 0 12px;
  opacity: .85;
`;

const TicketBody = styled.div`
  margin-top: 6px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  row-gap: 12px;
  column-gap: 10px;
  span {
    font-size: 0.72rem;
    text-transform: uppercase;
    letter-spacing: 0.02em;
    color: ${colors.purpleVeryLight};
  }
  strong {
    display: block;
    font-size: 1rem;
    margin-top: 3px;
  }
`;

const PriceAndQR = styled.div`
  margin-top: 16px;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
`;

const PriceBlock = styled.div`
  p {
    font-size: 0.7rem;
    color: ${colors.purpleVeryLight};
  }
  strong {
    display: block;
    font-size: 1.6rem;
  }
  small {
    font-size: 0.7rem;
    color: ${colors.purpleVeryLight};
  }
`;

const QRBox = styled.div`
  width: 95px;
  height: 95px;
  background: #fff;
  border-radius: 12px;
  padding: 5px; 
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${colors.primaryDark};
  font-size: 0.6rem;
  text-align: center;
`;

const TicketRight = styled.div`
  flex: 1;
  background: ${colors.offWhite};
  border-radius: 20px;
  padding: 22px 22px 26px;
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

const InfoRow = styled.div`
  h3 {
    font-size: 1.05rem;
    color: ${colors.textDarker};
    margin-bottom: 5px;
  }
  p {
    color: ${colors.textDark};
  }
`;

const ButtonsRow = styled.div`
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
  margin-top: 5px;
`;

const PrimaryButton = styled.button`
  background: ${colors.primaryDark};
  color: #fff;
  padding: 12px 26px;
  border-radius: 999px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  &:hover {
    background: ${colors.purpleMedium};
  }
`;

const SecondaryButton = styled.button`
  background: ${colors.white};
  color: ${colors.primaryDark};
  border: 1px solid ${colors.primaryDark};
  padding: 12px 26px;
  border-radius: 999px;
  font-weight: 600;
  cursor: pointer;
  &:hover {
    background: ${colors.purpleVeryLight};
  }
`;

// ==================================================
// =               CÓDIGOS NOVOS AQUI (STYLED)      =
// ==================================================
const RulesSection = styled.section`
  width: 100%;
  margin-top: 30px;
  padding-top: 30px;
  /* Usando a mesma borda do footer para separar */
  border-top: 1px solid rgba(0, 0, 0, 0.05);
`;

const RulesTitle = styled.h3`
  font-size: 1.3rem;
  color: ${colors.textDarker};
  margin-bottom: 20px;
  font-weight: 600;
`;

const RulesList = styled.ul`
  list-style: disc;
  padding-left: 25px; 
  color: ${colors.textDark};
  font-size: 0.9rem;
  line-height: 1.7;

  li {
    margin-bottom: 10px;
  }
`;
// ==================================================


const OrderFooter = styled.div`
  margin-top: 30px;
  display: flex;
  gap: 40px;
  flex-wrap: wrap;
  align-items: center;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
  padding-top: 20px;
`;

const OrderBlock = styled.div`
  p {
    margin-bottom: 2px;
    color: ${colors.textDark};
  }
  strong {
    font-size: 1.05rem;
    color: ${colors.primaryDark};
  }
`;

const PurchaseSuccess = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  // pega o primeiro item do pedido
  const first = state?.items?.[0] || {};

  const {
    game = 'Time A X Time B',
    category = 'Competição não informada',
    date,
    time,
    stadium,
    sector = 'Norte',
    unitPrice = 0,
    quantity = 1,
    teamA = 'Time A',
    teamB = 'Time B',
    qr_code,
  } = first;

  // --- Pega o OrderCode e Total reais ---
  const orderCode = state?.orderCode || 'ING-ERRO';
  const paid = state?.total ?? unitPrice * quantity;

  const logoAPath = getAsset(teamA);
const logoBPath = getAsset(teamB);

  // ==================================================
  // =     NOVO: Array de regras do evento            =
  // ==================================================
  const regrasDoEvento = [
    "É proibida a entrada com bebidas (exceto água em copo plástico).",
    "É proibida a entrada com camisas de times visitantes no setor da torcida local.",
    "Não é permitido o uso de fogos de artifício ou sinalizadores.",
    "Todos os participantes estarão sujeitos a uma revista na entrada.",
    "O ingresso é pessoal e intransferível. Apresente um documento oficial com foto na entrada."
  ];

  const handleOpenMap = () => navigate('/estadios/neo-quimica-arena');

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('Comprovante de Ingresso', 14, 20);
    doc.setFontSize(12);
    doc.text(`Pedido: ${orderCode}`, 14, 30);
    doc.text(`Jogo: ${game}`, 14, 40);
    doc.text(`Competição: ${category}`, 14, 50);
    doc.text(`Data/Hora: ${date || '—'} ${time ? `às ${time}` : ''}`, 14, 60);
    doc.text(`Estádio: ${stadium || '—'}`, 14, 70);
    doc.text(`Setor: ${sector}`, 14, 80);
    doc.text(`Qtd: ${quantity}`, 14, 90);
    doc.text(`Total: R$ ${(paid || 0).toFixed(2).replace('.', ',')}`, 14, 100);
    doc.setFontSize(8);
    doc.text(`QR Code: ${qr_code || 'N/A'}`, 14, 110);
    
    doc.setFontSize(10);
    doc.text('Regras Importantes:', 14, 125);
    let y = 130;
    regrasDoEvento.forEach(regra => {
      doc.text(`- ${regra}`, 14, y);
      y += 7;
    });

    doc.save(`${orderCode}.pdf`);
  };

  return (
    <PageWrapper>
      <TicketCard>
        <Header>
          <Title>
            Ingressou! Seu lugar está garantido no estádio
            <span>Ingresso enviado para o e-mail cadastrado.</span>
          </Title>
          <Badge>Pagamento aprovado ✅</Badge>
        </Header>

        <TicketAndActions>
          {/* Ticket visual */}
          <TicketLeft>
            <div>
              <TeamsRow>
                <div>
                  <h4>{teamA}</h4>
                  {logoAPath ? <TeamLogo src={logoAPath} alt={teamA} /> : null}
                </div>
                <Vs>VS</Vs>
                <div>
                  <h4 style={{ textAlign: 'right' }}>{teamB}</h4>
                  {logoBPath ? <TeamLogo src={logoBPath} alt={teamB} /> : null}
                </div>
              </TeamsRow>

              <CompName>{category}</CompName>

              <TicketBody>
                <div>
                  <span>Data</span>
                  <strong>{date || 'Data não informada'}</strong>
                </div>
                <div>
                  <span>Horário</span>
                  <strong>{time || 'Horário não informado'}</strong>
                </div>
                <div>
                  <span>Entrada / Setor</span>
                  <strong>{sector}</strong>
                </div>
                <div>
                  <span>Estádio</span>
                  <strong>{stadium || 'Estádio não informado'}</strong>
                </div>
              </TicketBody>
            </div>

            <PriceAndQR>
              <PriceBlock>
                <p>Valor pago</p>
                {/* Mostra o Total do Pedido, não o preço unitário */}
                <strong>R$ {(paid || 0).toFixed(2).replace('.', ',')}</strong>
                <small>{state?.items?.length || 1} ingresso(s) no total</small>
              </PriceBlock>
              
              {/* --- MUDANÇA: Mostra o QR Code real --- */}
              <QRBox>
                {qr_code ? (
                  <QRCodeSVG 
                    value={qr_code} 
                    size={85} // Tamanho para caber no box
                    bgColor={"#ffffff"}
                    fgColor={"#000000"}
                    level={"L"}
                    includeMargin={false}
                  />
                ) : (
                  'QR CODE'
                )}
              </QRBox>
            </PriceAndQR>
          </TicketLeft>

          {/* Ações / infos */}
          <TicketRight>
            <InfoRow>
              <h3>Código do pedido</h3>
              <p>{orderCode}</p> {/* <-- Mostra o OrderCode real */}
            </InfoRow>

            <InfoRow>
              <h3>O que fazer agora?</h3>
              <p>Você pode visualizar o mapa do estádio para planejar sua chegada ou baixar seu ingresso em PDF.</p>
            </InfoRow>

            <ButtonsRow>
              <PrimaryButton onClick={handleOpenMap}>Mapa do local</PrimaryButton>
              <SecondaryButton onClick={handleDownloadPDF}>Exportar ingresso (PDF)</SecondaryButton>
            </ButtonsRow>
          </TicketRight>
        </TicketAndActions>

        {/* ==================================================
          =               AQUI ESTÁ A MUDANÇA (JSX)        =
          ==================================================
        */}
        <RulesSection>
          <RulesTitle>Lembretes e Regras do Evento</RulesTitle>
          <RulesList>
            {regrasDoEvento.map((regra, index) => (
              <li key={index}>{regra}</li>
            ))}
          </RulesList>
        </RulesSection>
        {/* ================================================== */}


        <OrderFooter>
          <OrderBlock>
            <p>Pedido:</p>
            <strong>{orderCode}</strong> {/* <-- Mostra o OrderCode real */}
          </OrderBlock>
          <OrderBlock>
            <p>Total pago:</p>
            <strong>R$ {(paid || 0).toFixed(2).replace('.', ',')}</strong>
          </OrderBlock>
          <OrderBlock>
            <p>Estádio:</p>
            <strong>{stadium || '—'}</strong>
          </OrderBlock>
          <OrderBlock>
            <Link to="/ingressos" style={{ color: colors.primaryDark }}>
              Voltar para ingressos
            </Link>
          </OrderBlock>
        </OrderFooter>
      </TicketCard>
    </PageWrapper>
  );
};

export default PurchaseSuccess;