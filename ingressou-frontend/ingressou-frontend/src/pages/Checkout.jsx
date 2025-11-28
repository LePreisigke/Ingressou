// src/pages/Checkout.jsx
import React, { useState } from "react";
import styled from "styled-components";
import { colors } from "../styles/GlobalStyles";
import { useLocation, useNavigate, Link } from "react-router-dom";
import axios from 'axios'; 

function getAuthToken() {
  return localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
}

// --- Styled Components ---

const Page = styled.div`
  min-height: 100vh;
  background: ${colors.offWhite};
  padding: 50px 20px;
  display: flex;
  justify-content: center;
`;

const CheckoutBox = styled.div`
  width: 100%;
  max-width: 900px;
  background: ${colors.white};
  border-radius: 15px;
  padding: 40px 50px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
`;

const Title = styled.h1`
  color: ${colors.primaryDark};
  font-size: 2.2rem;
  margin-bottom: 10px;
`;

const Sub = styled.p`
  color: ${colors.textDark};
  margin-bottom: 30px;
`;

const PaymentMethods = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 40px;
`;

const MethodButton = styled.button`
  flex: 1;
  border: 2px solid
    ${(props) => (props.selected ? colors.primaryDark : colors.purpleVeryLight)};
  background: ${(props) =>
    props.selected ? colors.purpleLighter : colors.white};
  color: ${colors.primaryDark};
  border-radius: 10px;
  padding: 15px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${colors.primaryDark};
    background: ${colors.offWhite};
  }
`;

const FormSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Label = styled.label`
  font-weight: 600;
  color: ${colors.textDarker};
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 15px;
  border-radius: 10px;
  border: 1px solid ${colors.purpleVeryLight};
  font-size: 1rem;
  outline: none;

  &:focus {
    border-color: ${colors.purpleLight};
  }
`;

const Row = styled.div`
  display: flex;
  gap: 20px;
`;

const SummaryBox = styled.div`
  margin-top: 40px;
  background: ${colors.offWhite};
  padding: 20px;
  border-radius: 10px;
`;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  color: ${colors.textDark};
  margin-bottom: 10px;
  font-size: 1rem;
`;

const TotalRow = styled(SummaryRow)`
  font-weight: 700;
  color: ${colors.primaryDark};
  font-size: 1.3rem;
  border-top: 2px solid ${colors.purpleVeryLight};
  padding-top: 10px;
`;

const ConfirmButton = styled.button`
  width: 100%;
  background: ${colors.primaryDark};
  color: ${colors.white};
  border: none;
  border-radius: 10px;
  padding: 15px;
  margin-top: 40px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s ease;

  &:hover {
    background: ${colors.purpleMedium};
  }
  
  &:disabled {
    background-color: ${colors.purpleLight};
    cursor: not-allowed;
  }
`;

const BackLink = styled(Link)`
  display: inline-block;
  margin-top: 20px;
  color: ${colors.purpleMedium};
  text-decoration: underline;
  font-size: 0.95rem;
`;

const PixCodeBox = styled.div`
  background: ${colors.white};
  border: 1px dashed ${colors.purpleMedium};
  padding: 15px;
  border-radius: 8px;
  margin-top: 10px;
  font-family: monospace;
  color: ${colors.textDarker};
`;

const Message = styled.p`
  margin-top: 20px;
  padding: 12px 14px;
  border-radius: 8px;
  font-size: 0.95rem;
  color: #c0392b;
  background: #fdecea;
  border: 1px solid #f5c6cb;
`;

// --- Componente Principal ---

const Checkout = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  
  // 'data' agora contém { items, subtotal, total } vindos do Cart.jsx
  const data = state || { items: [], total: 0 };

  const [paymentMethod, setPaymentMethod] = useState("pix");
  const [cardData, setCardData] = useState({ /* ... */ });

  // --- MUDANÇA: States de API ---
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const formatPrice = (price) =>
    `R$ ${(price || 0).toFixed(2).replace(".", ",")}`;

  // --- MUDANÇA: Lógica de pagamento conectada à API ---
  const handleConfirmPayment = async () => {
    setError('');
    
    // 1. Validar pagamento (simples)
    if (paymentMethod === 'card') {
      // (Aqui entraria a validação real do cartão)
      if (!cardData.name || !cardData.number || !cardData.expiry || !cardData.cvv) {
        setError('Por favor, preencha todos os dados do cartão.');
        return;
      }
    }
    
    // 2. Verificar se o usuário está logado
    const token = getAuthToken();
    if (!token) {
      setError('Sessão expirada. Por favor, faça login novamente.');
      setTimeout(() => navigate('/login'), 2000);
      return;
    }

    setIsLoading(true);

    try {
      // 3. (A mesma lógica que movemos do Cart.jsx)
      // Criar uma promessa de compra para cada ingresso
      const purchasePromises = [];
      const itemsToPurchase = []; // Para enviar para a tela de sucesso

      data.items.forEach(item => {
        for (let i = 0; i < (item.quantity || 1); i++) {
          purchasePromises.push(
            axios.post(
              'http://localhost:8080/api/ingressos',
              { id_jogo: item.id_jogo, id_setor: item.id_setor },
              { headers: { 'Authorization': `Bearer ${token}` } }
            )
          );
          itemsToPurchase.push(item); // Guarda o item de display
        }
      });

      // 4. Executar todas as compras
      const results = await Promise.all(purchasePromises);

      // 5. Juntar os dados
      const finalPurchasedItems = results.map((result, index) => {
        const displayInfo = itemsToPurchase[index];
        const apiInfo = result.data.ingresso;
        return { ...displayInfo, ...apiInfo };
      });
      
      const orderCode = `ING-${finalPurchasedItems[0].id_usuario}-${finalPurchasedItems[0].id_ingresso}`;

      // 6. Limpar o carrinho (agora que o pagamento foi 100% OK)
      localStorage.removeItem('cart_items');
      
      // 7. Navegar para a tela de sucesso
      navigate("/finalizar/sucesso", {
        state: {
          items: finalPurchasedItems,
          total: data.total,
          orderCode: orderCode,
        },
      });

    } catch (apiError) {
      if (apiError.response && apiError.response.data) {
        setError(apiError.response.data.message);
      } else {
        setError('Erro de rede. Não foi possível finalizar a compra.');
      }
      setIsLoading(false);
    }
  };

  return (
    <Page>
      <CheckoutBox>
        <Title>Pagamento</Title>
        <Sub>Selecione o método de pagamento e finalize sua compra</Sub>

        <PaymentMethods>
          <MethodButton
            selected={paymentMethod === "pix"}
            onClick={() => setPaymentMethod("pix")}
          >
            💠 Pix
          </MethodButton>
          <MethodButton
            selected={paymentMethod === "card"}
            onClick={() => setPaymentMethod("card")}
          >
            💳 Cartão de Crédito
          </MethodButton>
        </PaymentMethods>

        {/* Campos de pagamento */}
        {paymentMethod === "card" ? (
          <FormSection>
            <Label>Nome no cartão</Label>
            <Input
              placeholder="Ex: GABRIELA SOUZA"
              value={cardData.name}
              onChange={(e) =>
                setCardData({ ...cardData, name: e.target.value })
              }
            />
            <Label>Número do cartão</Label>
            <Input
              placeholder="**** **** **** ****"
              maxLength={19}
              value={cardData.number}
              onChange={(e) =>
                setCardData({ ...cardData, number: e.target.value })
              }
            />
            <Row>
              <div style={{ flex: 1 }}>
                <Label>Validade</Label>
                <Input
                  placeholder="MM/AA"
                  value={cardData.expiry}
                  onChange={(e) =>
                    setCardData({ ...cardData, expiry: e.target.value })
                  }
                />
              </div>
              <div style={{ flex: 1 }}>
                <Label>CVV</Label>
                <Input
                  placeholder="***"
                  value={cardData.cvv}
                  onChange={(e) =>
                    setCardData({ ...cardData, cvv: e.target.value })
                  }
                />
              </div>
            </Row>
          </FormSection>
        ) : (
          <FormSection>
            <Label>Escaneie o QR Code ou copie o código Pix abaixo:</Label>
            <PixCodeBox>
              00020126360014BR.GOV.BCB.PIX0114+55999999999204000053039865407
              00.005802BR5920Ingressou Eventos6009SAO PAULO62290525ABC123XYZ654321XYZ6304ABCD
            </PixCodeBox>
          </FormSection>
        )}

        {/* Resumo */}
        <SummaryBox>
          <SummaryRow>
            <span>Subtotal</span>
            <span>{formatPrice(data.subtotal)}</span>
          </SummaryRow>
          <TotalRow>
            <span>Total a pagar</span>
            <span>{formatPrice((data.total || 0))}</span>
          </TotalRow>
        </SummaryBox>

        {/* ---  Exibe o erro aqui --- */}
        {error && <Message type="error">{error}</Message>}

        <ConfirmButton onClick={handleConfirmPayment} disabled={isLoading}>
          {isLoading ? 'Confirmando Pagamento...' : 'Confirmar Pagamento'}
        </ConfirmButton>

        <BackLink to="/carrinho">← Voltar ao carrinho</BackLink>
      </CheckoutBox>
    </Page>
  );
};

export default Checkout;
