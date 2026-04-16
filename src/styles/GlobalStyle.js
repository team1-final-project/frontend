import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  body {
    ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
  ::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 4px;
  }
  ::-webkit-scrollbar-thumb:hover {
    background: #94a3b8;
  }
  ::-webkit-scrollbar-track {
    background: transparent;
  }    
  }
  :root {
    /* 색상 정의 */
    --blue : #0F60FF;
    --red : #EA5455;
    --green : #1EB564;
    --yellow : #FFC600;
    --purple : #BD00FF;
    --violet : #33189D;
    --rightblue : #0FB7FF;

    --background : #FAFAFA;

    --border : #EAEAEA;

    --hover-gray : #F3F4F8;

    --font : #000000;
    --font2 : #828282;

    --placeholder : #8B909A;

    /* 박스 그림자 */
    --shadow : 5px 3px 6px rgba(0, 0, 0, 0.1), 0 3px 6px rgba(0, 0, 0, 0.15);


    /* 폰트 사이즈 정의 */
    --title : 22px;
    --th : 11px;
    --td :  12px;

  }
  button {
    background: none;
    border: none;
    padding: 0;
    cursor: pointer; 
    font-family: inherit;
  }
  input, textarea {
    outline: none; 
    border: none;
    font-family: inherit; 
    font-size: inherit
  }
  a {
    text-decoration: none;
    color: inherit;   
  }
  ul, li {
    list-style: none;  
  }
  img {
    max-width: 100%;
    display: block;  
  }
  svg:focus {
  outline: none; 
  }

  svg *:focus {
  outline: none; 
  }
`;

export default GlobalStyle;
