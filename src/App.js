import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import GlobalStyle from "./styles/GlobalStyle";
import theme from "./styles/Theme";
import { AuthProvider } from "./context/AuthContext";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import SocialLoginCallback from "./pages/SocialLoginCallback";

import TossPayTestPage from "./pages/TossPayTestPage";
import TossSuccessPage from "./pages/TossSuccessPage";
import TossFailPage from "./pages/TossFailPage";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <GlobalStyle />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/toss" element={<TossPayTestPage />} />
        <Route path="/toss/success" element={<TossSuccessPage />} />
        <Route path="/toss/fail" element={<TossFailPage />} />
          <Route
            path="/auth/google/callback"
            element={<SocialLoginCallback />}
          />
          <Route
            path="/auth/kakao/callback"
            element={<SocialLoginCallback />}
          />
          <Route
            path="/auth/naver/callback"
            element={<SocialLoginCallback />}
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;