import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import GlobalStyle from "./styles/GlobalStyle";
import theme from "./styles/Theme";
import { AuthProvider } from "./context/AuthContext";
import GoogleLoginCallbackPage from "./test/GoogleLoginCallbackPage";
import KakaoLoginCallbackPage from "./test/KakaoLoginCallbackPage";
import NaverLoginCallbackPage from "./test/NaverLoginCallbackPage";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AuthTestPage from "./test/AuthTestPage";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <GlobalStyle />
        <Routes>
          <Route path="/" element={<AuthTestPage />} />
          <Route
            path="/auth/google/callback"
            element={<GoogleLoginCallbackPage />}
          />
          <Route
            path="/auth/kakao/callback"
            element={<KakaoLoginCallbackPage />}
          />
          <Route
            path="/auth/naver/callback"
            element={<NaverLoginCallbackPage />}
          />
          <Route path="*" element={<Navigate to="/" replace />} />

          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
