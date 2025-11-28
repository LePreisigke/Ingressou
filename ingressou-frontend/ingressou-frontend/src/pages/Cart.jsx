// src/pages/Cart.jsx
import React, { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { colors } from '../styles/GlobalStyles';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios'; // <-- ADICIONADO

// --- Styled Components ---

const CartContainer = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 50px 20px;
  display: flex;
  flex-direction: column;
`;

const CartHeader = styled.h1`
  font-size: 2.5rem;
  color: ${colors.primaryDark};
  margin-bottom: 30px;
  border-bottom: 3px solid ${colors.purpleMedium};
  padding-bottom: 10px;
`;

const CartContent = styled.div`
  display: flex;
  gap: 30px;
`;

const ItemsSection = styled.div`
  flex: 2;
`;

const SummarySection = styled.div`
  flex: 1;
  background-color: ${colors.offWhite};
  padding: 20px;
  border-radius: 10px;
  height: fit-content;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
`;

const CartItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: ${colors.white};
  padding: 20px;
  border-radius: 10px;
  margin-bottom: 15px;
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.05);
`;

const ItemDetails = styled.div`
  flex: 3;
`;

const ItemTitle = styled.h3`
  font-size: 1.2rem;
  color: ${colors.textDarker};
  margin-bottom: 5px;
`;

const ItemSubtitle = styled.p`
  font-size: 0.9rem;
  color: ${colors.textDark};
`;

const ItemPrice = styled.span`
  flex: 1;
  font-size: 1.2rem;
  font-weight: 600;
  color: ${colors.primaryDark};
  text-align: right;
`;

const QuantityControl = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1;
  justify-content: center;
`;

const ControlButton = styled.button`
  background-color: ${colors.purpleLight};
  color: ${colors.white};
  border: none;
  width: 30px;
  height: 30px;
  border-radius: 5px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: ${colors.purpleMedium};
  }
`;

const QuantityDisplay = styled.span`
  font-size: 1.1rem;
  font-weight: 600;
  color: ${colors.textDarker};
`;

const RemoveButton = styled.button`
  background: none;
  border: none;
  color: #ff4d4d;
  font-size: 1.5rem;
  cursor: pointer;
  margin-left: 20px;
  transition: color 0.3s ease;

  &:hover {
    color: #cc0000;
  }
`;

// Summary
const SummaryTitle = styled.h2`
  font-size: 1.8rem;
  color: ${colors.primaryDark};
  margin-bottom: 20px;
`;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
  font-size: 1.1rem;
  color: ${colors.textDark};
`;

const TotalRow = styled(SummaryRow)`
  border-top: 2px solid ${colors.purpleVeryLight};
  padding-top: 15px;
  font-size: 1.4rem;
  font-weight: 700;
  color: ${colors.primaryDark};
`;

const ActionLink = styled(Link)`
  display: block;
  width: 100%;
  text-align: center;
  padding: 15px;
  margin-top: 15px;
  border-radius: 5px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &.continue {
    background-color: ${colors.white};
    color: ${colors.primaryDark};
    border: 1px solid ${colors.primaryDark};
    &:hover {
      background-color: ${colors.purpleLight};
    }
  }
`;

const FinishButton = styled.button`
  display: block;
  width: 100%;
  text-align: center;
  padding: 15px;
  margin-top: 15px;
  border-radius: 5px;
  font-weight: 600;
  cursor: pointer;
  border: none;
  background-color: ${colors.primaryDark};
  color: ${colors.white};
  transition: background-color 0.3s ease;
  &:hover {
    background-color: ${colors.purpleMedium};
  }
  &:disabled {
    background-color: ${colors.purpleLight};
    cursor: not-allowed;
  }
`;

const BackButton = styled.button`
  align-self: flex-start;
  margin-bottom: 10px;
  background: none;
  border: none;
  color: ${colors.primaryDark};
  font-weight: 600;
  cursor: pointer;
`;

const EmptyCart = styled.div`
  text-align: center;
  padding: 50px;
  background-color: ${colors.white};
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  h2 {
    color: ${colors.textDarker};
    margin-bottom: 15px;
  }
`;

const Message = styled.p`
  margin: 10px 0;
  padding: 12px 14px;
  border-radius: 8px;
  font-size: 0.95rem;
  ${({ type }) =>
    type === 'error'
      ? `
    color: #c0392b;
    background: #fdecea;
    border: 1px solid #f5c6cb;
  `
      : `
    color: #1e7e34;
    background: #e7f6ec;
    border: 1px solid #c3e6cb;
  `}
`;

// -------- Component --------

const Cart = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // item vindo do BuyTicket (Link state)
  const incoming = location.state?.item || null;

  // carrega carrinho do storage
  const loadSaved = () => {
    try {
      const raw = localStorage.getItem('cart_items');
      if (!raw) return [];
      return JSON.parse(raw);
    } catch {
      return [];
    }
  };

  const [items, setItems] = useState(loadSaved());

  // --- MUDANÇA: States de API ---
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // (useEffect de DEDUPE + MERGE - mantido 100%)
  useEffect(() => {
    if (!incoming) return;
    const addKey = `cart_added_${location.key}`;
    if (sessionStorage.getItem(addKey)) return;
    sessionStorage.setItem(addKey, '1');

    setItems((prev) => {
      const idx = prev.findIndex(
        (it) =>
          it.game === incoming.game &&
          it.sector === incoming.sector &&
          (it.unitPrice || 0) === (incoming.unitPrice || 0)
      );
      let updated;
      if (idx >= 0) {
        const addQty = incoming.quantity || 1;
        updated = prev.map((it, i) =>
          i === idx
            ? {
                ...it,
                quantity: (it.quantity || 1) + addQty,
                total: (it.unitPrice || 0) * ((it.quantity || 1) + addQty),
              }
            : it
        );
      } else {
        updated = [
          ...prev,
          {
            id: Date.now(),
            ...incoming,
          },
        ];
      }
      localStorage.setItem('cart_items', JSON.stringify(updated));
      return updated;
    });
  }, [incoming, location.key]);

  // persiste em qualquer alteração
  useEffect(() => {
    localStorage.setItem('cart_items', JSON.stringify(items));
  }, [items]);

  const formatPrice = (price) => `R$ ${price.toFixed(2).replace('.', ',')}`;

  const handleQuantityChange = (id, change) => {
    setItems((prev) =>
      prev.map((it) =>
        it.id === id
          ? {
              ...it,
              quantity: Math.max(1, (it.quantity || 1) + change),
              total: (it.unitPrice || 0) * Math.max(1, (it.quantity || 1) + change),
            }
          : it
      )
    );
  };

  const handleRemoveItem = (id) => {
    setItems((prev) => prev.filter((it) => it.id !== id));
  };

  const subtotal = useMemo(
    () => items.reduce((acc, it) => acc + (it.unitPrice || 0) * (it.quantity || 1), 0),
    [items]
  );

  const shipping = 0;
  const total = subtotal + shipping;

  // --- MUDANÇA: handleFinish atualizado para chamar a API ---
  const handleFinish = () => {
    // Não chama mais a API. Apenas navega para a tela de Checkout
    // e envia os itens e o total no 'state' da rota.
    navigate('/checkout', {
      state: {
        items,    // O array de itens do carrinho
        subtotal,
        shipping,
        total,
      },
    });
  };

  // 5. Calcula o total e o código do pedido com base nos dados reais
  
  const handleBack = () => navigate(-1);

  if (items.length === 0) {
    return (
      <CartContainer>
        <CartHeader>Seu Carrinho</CartHeader>
        <EmptyCart>
          <h2>Seu carrinho está vazio!</h2>
          <p>Adicione ingressos para começar sua experiência.</p>
          <ActionLink to="/ingressos" className="continue" style={{ width: '300px', margin: '20px auto' }}>
            Continuar Comprando
          </ActionLink>
        </EmptyCart>
      </CartContainer>
    );
  }

  return (
    <CartContainer>
      <BackButton onClick={handleBack} disabled={isLoading}>← Voltar</BackButton>
      <CartHeader>Seu Carrinho</CartHeader>

      <CartContent>
        <ItemsSection>
          {items.map((item) => (
            <CartItem key={item.id}>
              <ItemDetails>
                <ItemTitle>{item.game}</ItemTitle>
                <ItemSubtitle>Setor: {item.sector}</ItemSubtitle>
              </ItemDetails>
              <QuantityControl>
                <ControlButton onClick={() => handleQuantityChange(item.id, -1)} disabled={isLoading}>-</ControlButton>
                <QuantityDisplay>{item.quantity || 1}</QuantityDisplay>
                <ControlButton onClick={() => handleQuantityChange(item.id, 1)} disabled={isLoading}>+</ControlButton>
              </QuantityControl>
              <ItemPrice>{formatPrice(item.total)}</ItemPrice>
              <RemoveButton onClick={() => handleRemoveItem(item.id)} disabled={isLoading}>&times;</RemoveButton>
            </CartItem>
          ))}
        </ItemsSection>

        <SummarySection>
          <SummaryTitle>Resumo do Pedido</SummaryTitle>
          <SummaryRow>
            <span>Subtotal ({items.length} itens)</span>
            <span>{formatPrice(subtotal)}</span>
          </SummaryRow>
          <SummaryRow>
            <span>Entrega</span>
            <span>{formatPrice(shipping)}</span>
          </SummaryRow>
          <TotalRow>
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </TotalRow>

          {/* --- MUDANÇA: Exibe o erro aqui --- */}
          {error && <Message type="error">{error}</Message>}

          <FinishButton onClick={handleFinish} disabled={isLoading}>
            {isLoading ? 'Processando...' : 'Finalizar Compra'}
          </FinishButton>

          <ActionLink to="/ingressos" className="continue">
            Continuar Comprando
          </ActionLink>
        </SummarySection>
      </CartContent>
    </CartContainer>
  );
};

export default Cart;
