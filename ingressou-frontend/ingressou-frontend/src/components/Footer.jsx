import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { colors } from '../styles/GlobalStyles';
import Logo from '../assets/Ativo4.svg'; // Logo do site

const FooterContainer = styled.footer`
  width: 100%;
  background-color: ${colors.primaryDark};
  color: ${colors.white};
  padding: 40px 5%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const FooterContent = styled.div`
  width: 100%;
  max-width: 1200px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  border-bottom: 1px solid ${colors.purpleMedium};
  padding-bottom: 20px;
  margin-bottom: 20px;
`;

const LogoSection = styled.div`
  margin-bottom: 20px;
`;

const LogoImage = styled.img`
  height: 60px;
`;

const LinksSection = styled.div`
  display: flex;
  gap: 50px;
  flex-wrap: wrap;
`;

const LinkGroup = styled.div`
  display: flex;
  flex-direction: column;

  h4 {
    font-size: 1.2rem;
    margin-bottom: 10px;
    color: ${colors.purpleLighter};
  }
`;

const FooterLink = styled(Link)`
  color: ${colors.white};
  margin-bottom: 5px;
  font-size: 0.9rem;

  &:hover {
    color: ${colors.purpleLighter};
  }
`;

const CopyrightSection = styled.div`
  width: 100%;
  max-width: 1200px;
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
  color: ${colors.purpleLighter};
`;

const Footer = () => {
  return (
    <FooterContainer>
      <FooterContent>
        <LogoSection>
          <LogoImage src={Logo} alt="Ingressou Logo" />
        </LogoSection>
        <LinksSection>
          <LinkGroup>
            <FooterLink to="/">Início</FooterLink>
            <FooterLink to="/ingressos">Ingressos</FooterLink>
            <FooterLink to="/estadios">Estádios</FooterLink>
            <FooterLink to="/quiosques">Quiosques</FooterLink>
          </LinkGroup>
          <LinkGroup>
            <FooterLink to="/refund-policy">Refund Policy</FooterLink>
            <FooterLink to="/accessibility">Accessibility Statement</FooterLink>
            <FooterLink to="/privacy">Privacy Policy</FooterLink>
            <FooterLink to="/terms">Terms & Conditions</FooterLink>
          </LinkGroup>
          <LinkGroup>
            <FooterLink to="https://youtube.com" target="_blank">Youtube</FooterLink>
            <FooterLink to="https://facebook.com" target="_blank">Facebook</FooterLink>
            <FooterLink to="https://linkedin.com" target="_blank">LinkedIn</FooterLink>
          </LinkGroup>
        </LinksSection>
      </FooterContent>
      <CopyrightSection>
        <span>Todos os direitos reservados INGRESSOU</span>
      </CopyrightSection>
    </FooterContainer>
  );
};

export default Footer;
