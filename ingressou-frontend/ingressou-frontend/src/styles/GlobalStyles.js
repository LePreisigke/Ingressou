import { createGlobalStyle } from 'styled-components';

export const colors = {
  // Cores da Paleta
  primaryDark: '#3C096C', // Cor 5
  secondaryDark: '#5A189A', // Cor 6
  purpleMedium: '#7B2CBF', // Cor 7
  purpleLight: '#9D4EDD', // Cor 8
  purpleLighter: '#C77DFF', // Cor 9
  purpleVeryLight: '#E0AAFF', // Cor 10
  textDark: '#10002B', // Cor 11
  textDarker: '#200352', // Cor 12
  white: '#FAF9F6', // Cor 1
  offWhite: '#FEFEEB', // Cor 2
  beige: '#E6D8AD', // Cor 3
};

const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Arial', sans-serif; /* Usando Arial como fallback, idealmente seria uma fonte do design */
  }

  body {
    background-color: ${colors.white};
    color: ${colors.textDark};
    line-height: 1.6;
  }

  a {
    text-decoration: none;
    color: ${colors.primaryDark};
  }
`;

export default GlobalStyles;
