import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import GlobalStyle from "./styles/GlobalStyle";
import theme from "./styles/Theme";
import { AuthProvider } from "./context/AuthContext";

import MainLayout from "./layout/MainLayout";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import SocialLoginCallback from "./pages/SocialLoginCallback";

import TossPayTestPage from "./test/paymentapi/TossPayTestPage";
import TossSuccessPage from "./test/paymentapi/TossSuccessPage";
import TossFailPage from "./test/paymentapi/TossFailPage";
import ProductDetailPage from "./pages/ProductDetailPage";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <GlobalStyle />
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/product-detail" element={<ProductDetailPage />} />
          </Route>

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
