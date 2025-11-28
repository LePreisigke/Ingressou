import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Link, useLocation } from 'react-router-dom';
import { colors } from '../styles/GlobalStyles';
import Logo from '../assets/Ativo4.svg'; // Logo do site
// NOVO: Importando os ícones
import { FaShoppingCart, FaUser, FaSignInAlt } from 'react-icons/fa';

const HeaderContainer = styled.header`
  width: 100%;
  background-color: ${colors.white};
  padding: 15px 5%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
`;

const LogoLink = styled(Link)`
  display: flex;
  align-items: center;
`;

const LogoImage = styled.img`
  height: 40px;
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: 30px; /* MODIFICADO: 'gap' cuida do espaçamento */
`;

const NavList = styled.ul`
  display: flex;
  list-style: none;
  /* margin-right: 30px; -> Removido em favor do 'gap' no <Nav> */
`;

const NavItem = styled.li`
  margin: 0 15px;
`;

const NavLink = styled(Link)`
  color: ${colors.textDark};
  font-weight: 600;
  font-size: 1rem;
  padding: 5px 0;
  transition: color 0.3s ease;

  &:hover {
    color: ${colors.purpleMedium};
  }
`;

// ===================================
// =       NOVO STYLED COMPONENT     =
// ===================================
const CartLink = styled(Link)`
  display: flex;
  align-items: center;
  color: ${colors.primaryDark};
  font-size: 1.5rem; /* Tamanho do ícone do carrinho */
  transition: color 0.3s ease;

  &:hover {
    color: ${colors.purpleMedium};
  }
`;

const PillButton = styled(Link)`
  border: none;
  padding: 10px 20px;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 50px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  display: flex;
  align-items: center;
  text-decoration: none;
  gap: 8px; /* MODIFICADO: Adiciona espaço entre o ícone e o texto */
`;

const LoginButton = styled(PillButton)`
  background-color: ${colors.primaryDark};
  color: ${colors.white};

  &:hover {
    background-color: ${colors.purpleMedium};
  }

  /* &::before { ... } -> Removido em favor do ícone */
`;

const ProfileButton = styled(PillButton)`
  background-color: ${colors.white};
  color: ${colors.primaryDark};
  border: 1px solid ${colors.primaryDark};

  &:hover {
    background-color: ${colors.purpleVeryLight};
  }

  /* &::before { ... } -> Removido em favor do ícone */
`;

const AdminLink = styled(Link)`
  color: ${colors.primaryDark};
  font-weight: 700;
  margin-right: 15px;
  border: 2px solid ${colors.primaryDark};
  padding: 8px 15px;
  border-radius: 20px;
  font-size: 0.9rem;
  &:hover {
    background: ${colors.primaryDark};
    color: #fff;
  }
`;

function readLoggedUser() {
  try {
    // 1. Tenta o localStorage primeiro (para "Lembrar de mim")
    let raw = localStorage.getItem('loggedUser');
    
    // 2. Se não achar, tenta o sessionStorage (login normal)
    if (!raw) {
      raw = sessionStorage.getItem('loggedUser');
    }
    
    // 3. Retorna o que encontrou (ou null)
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

const Header = () => {
  const [user, setUser] = useState(() => readLoggedUser());
  const location = useLocation(); // força rechecagem ao navegar

  useEffect(() => {
    // Checa ao montar
    setUser(readLoggedUser());

    // Ouve quando Auth.jsx dispara "auth:changed"
    const onAuthChanged = () => setUser(readLoggedUser());
    window.addEventListener('auth:changed', onAuthChanged);

    // Ouve mudanças no localStorage (outra aba)
    const onStorage = (e) => {
      if (e.key === 'loggedUser') setUser(readLoggedUser());
    };
    window.addEventListener('storage', onStorage);

    return () => {
      window.removeEventListener('auth:changed', onAuthChanged);
      window.removeEventListener('storage', onStorage);
    };
  }, []);

  // Revalida ao mudar de rota (caso algo tenha mudado no meio do caminho)
  useEffect(() => {
    setUser(readLoggedUser());
  }, [location.pathname]);

  return (
    <HeaderContainer>
      <LogoLink to="/">
        <LogoImage src={Logo} alt="Ingressou Logo" />
      </LogoLink>
      <Nav>
        <NavList>
          <NavItem><NavLink to="/">Início</NavLink></NavItem>
          <NavItem><NavLink to="/ingressos">Ingressos</NavLink></NavItem>
          <NavItem><NavLink to="/estadios">Estádios</NavLink></NavItem>
          <NavItem><NavLink to="/quiosques">Quiosques</NavLink></NavItem>
        </NavList>

        {/* ===================================
          =       ✅ ÍCONE ADICIONADO AQUI      =
          =================================== */}
        <CartLink to="/carrinho" title="Ver carrinho">
          <FaShoppingCart />
        </CartLink>
          {user && user.is_admin && (
        <AdminLink to="/admin">
          Painel Admin
        </AdminLink>
      )}
        {user ? (
          <ProfileButton to="/perfil">
            <FaUser /> {/* Ícone de perfil */}
            Meu Perfil
          </ProfileButton>
        ) : (
          <LoginButton to="/login">
            <FaSignInAlt /> {/* Ícone de login */}
            Login
          </LoginButton>
        )}
      </Nav>
    </HeaderContainer>
  );
};

export default Header;