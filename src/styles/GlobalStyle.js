import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }
    
    html, body, #root {
        width: 100%;
        min-height: 100%;
    }
    
    body {
        font-family: "Pretendard", "Noto Sans KR", sans-serif;
        background-color: ${({ theme }) => theme.colors.bg};
        color: ${({ theme }) => theme.colors.text};
    }

    a {
        color : inherit;
        text-decoration: none;
    }

    button,
    input,
    textarea,
    select {
        font: inherit;
    }

    button {
        border: none;
        background: none;
        cursor: pointer;
    }

    input,
    textarea,
    select,
    button {
        outline: none;
    }

    ul,
    ol {
        list-style: none;
    }
`;

export default GlobalStyle;
