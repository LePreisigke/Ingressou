import React from 'react';
import Header from './Header';
import Footer from './Footer';
import styled from 'styled-components';

const MainContent = styled.main`
  min-height: 80vh;
`;

const Layout = ({ children }) => {
  return (
    <>
      <Header />
      <MainContent>
        {children}
      </MainContent>
      <Footer />
    </>
  );
};

export default Layout;
