import { createGlobalStyle } from "styled-components";

export const GlobalStyles = createGlobalStyle`
  html {
    font-size: 65%;
    font-family: ${({ theme }) => theme.fonts.body};
    box-sizing: border-box;
    scroll-behavior: smooth;
  }

  *,
  *::after,
  *::before {
    box-sizing: inherit;
    padding: 0;
    margin: 0;
    line-height: 1.4;
  }

  body {
    font-size: ${({ theme }) => theme.fontSizes.md};
    min-height: 100vh;
    overflow: hidden;
    padding: 0 0;
    background: ${({ theme }) => theme.background};
    color: ${({ theme }) => theme.text.primary};
    -webkit-font-smoothing: antialiased;
    text-rendering: geometricPrecision;
  }

  @media (max-width: 1100px) {
    body {
      overflow: auto;
      -webkit-overflow-scrolling: touch;
    }
  }

  #root {
    min-height: 100vh;
  }

  a,
  button {
    text-decoration: none;
    cursor: pointer;
    border: none;
    font-family: inherit;
    background: none;
    color: inherit;
    outline-color: ${({ theme }) => theme.misc.blue};
  }

  *:focus-visible {
    outline: 2.5px solid ${({ theme }) => theme.misc.blue};
    outline-offset: 2px;
    transition: outline-color 120ms;
  }

  a:hover {
    text-decoration: underline;
  }

  ul,
  li {
    list-style: none;
  }

  img {
    max-width: 100%;
    display: block;
  }

  input {
    font-family: inherit;
  }

  ::selection {
    background: ${({ theme }) => theme.alpha.accent24};
    color: ${({ theme }) => theme.misc.white};
  }

  p,
  li,
  h1,
  h2,
  h3,
  h4 {
    overflow-wrap: break-word;
  }
`;
