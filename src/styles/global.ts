import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  html,
  body {
    padding: 0;
    margin: 0;
    font-family: 'Bebas Neue', cursive !important;
    font-weight: 700 !important;
    letter-spacing: 1px !important;
    line-height: 1.2 !important;
    font-size: 1.6rem;
    color: ${({ theme }) => theme.colors.text};
    background-color: #0f051d;    
   }

  html {
    font-size: 62.5%; // 1rem = 10px
    height: 100%;
  }

  body {
    text-rendering: optimizeLegibility !important;
    -webkit-font-smoothing: antialiased !important;
    -moz-osx-font-smoothing: grayscale;
    min-height: 100%;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  * {
    box-sizing: border-box;
    padding: 0;
    margin: 0;
  }

  ::-webkit-scrollbar {
    height: 6px;
    width: 3px;
    background-color:#787878;
  }

  ::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.7);
    -webkit-border-radius: 8px;
  }

  .dropdown {
    background: #edd4fe!important;
    width: 100%;
    max-width: 300px;
    border-radius: 20px;
    transition: all .2s ease;
    color: #000;
    font-family: 'Bebas Neue', cursive !important;

    
  }
  
  .dropdown-control {
    font-family: 'Bebas Neue', cursive !important;

    background-color: transparent;
    border: none;
    padding: 0;
    width: 100%;
    max-width: 300px;
    padding: 24px 32px;
    cursor: pointer;
    color: #000;

  }
  
  .dropdown-placeholder {
    font-family: 'Bebas Neue', cursive !important;

  }
  
  .dropdown-menu {
    font-family: 'Bebas Neue', cursive !important;
    background-color: '#edd4fe';
    margin-top: 4px;
    border-radius: 12px;
    padding: 8px 4px;
    width: 100%;
    max-width: 300px;
    border: none;
    top: 45%;
    transition: all .2s ease;
    color: #000;


    .is-selected {
      background-color: #edd4fe;
      font-family: 'Bebas Neue', cursive !important;


      h6, span {
        font-family: 'Bebas Neue', cursive !important;
        color: #000;
        font-weight: bold;
      }

      :hover {
        background-color: #edd4fe !important;
      }
    }
  }

  .dropdown-arrow {
    right: 24px;
    font-family: 'Bebas Neue', cursive !important;

    top: 32px;
    width: 12px;
    color: #000 !important;
    font-weight: bold !important;
  }

  .Dropdown-option {
    padding: 8px 24px;
    color: #000;
    font-family: 'Bebas Neue', cursive !important;



    :hover {
      background: rgba(255, 255, 255, .3);
      border-radius: 12px;
    }
  }
`;
