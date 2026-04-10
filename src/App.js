import React from "react";
import { Routes, Route } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import GlobalStyle from "./styles/GlobalStyle";
import theme from "./styles/Theme";
import { AuthProvider } from "./context/AuthContext";

import MainLayout from "./layout/MainLayout";
import AdminLayout from "./layout/AdminLayout";

import Home from "./pages/consumer/Home";
import Login from "./pages/consumer/Login";
import Signup from "./pages/consumer/Signup";
import SocialLoginCallback from "./pages/consumer/SocialLoginCallback";

import TossPayTestPage from "./test/paymentapi/TossPayTestPage";
import TossSuccessPage from "./test/paymentapi/TossSuccessPage";
import TossFailPage from "./test/paymentapi/TossFailPage";
import ProductDetailPage from "./pages/consumer/ProductDetailPage";
import CartPage from "./pages/consumer/CartPage";
import CheckoutPage from "./pages/consumer/CheckoutPage";


import Dashboard from "./pages/admin/Dashboard";
import OrderListPage from "./pages/admin/OrderListTest";


function App() {
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <GlobalStyle />
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/product-detail" element={<ProductDetailPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkoutPage" element={<CheckoutPage />} />
          </Route>

          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/toss" element={<TossPayTestPage />} />
          <Route path="/toss/success" element={<TossSuccessPage />} />
          <Route path="/toss/fail" element={<TossFailPage />} />

          <Route path="/admin" element={<AdminLayout />}>
            <Route path="/admin" element={<Dashboard />} />
            <Route path="/admin/order-list" element={<OrderListPage />} />
          </Route>

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
        </Routes>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
