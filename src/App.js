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
import Products from "./pages/admin/Products";
import PriceTrend from "./pages/admin/PriceTrend";
import ProductManage from "./pages/admin/ProductManage";
import PriceSearch from "./pages/admin/PriceSearch";
import MatchingManage from "./pages/admin/MatchingManage";
import AIHistory from "./pages/admin/AIHistory";
import LiveInventory from "./pages/admin/LiveInventory";
import InventoryHistory from "./pages/admin/InventoryHistory";
import SalesStat from "./pages/admin/SalesStat";
import HeatmapStat from "./pages/admin/HeatmapStat";
import PriceTrendStat from "./pages/admin/PriceTrendStat";
import AdminManage from "./pages/admin/AdminManage";
import Settings from "./pages/admin/Settings";
import AdminLogin from "./pages/admin/AdminLogin";

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
            <Route path="/admin/products" element={<Products />} />
            <Route path="/admin/price-trend" element={<PriceTrend />} />
            <Route path="/admin/product-manage" element={<ProductManage />} />
            <Route path="/admin/price-search" element={<PriceSearch />} />
            <Route path="/admin/matching-manage" element={<MatchingManage />} />
            <Route path="/admin/ai-history" element={<AIHistory />} />
            <Route path="/admin/live-inventory" element={<LiveInventory />} />
            <Route
              path="/admin/inventory-history"
              element={<InventoryHistory />}
            />
            <Route path="/admin/sales-stat" element={<SalesStat />} />
            <Route path="/admin/heatmap-stat" element={<HeatmapStat />} />
            <Route
              path="/admin/price-trend-stat"
              element={<PriceTrendStat />}
            />
            <Route path="/admin/manage-admins" element={<AdminManage />} />
            <Route path="/admin/settings" element={<Settings />} />
          </Route>

          <Route path="/admin/login" element={<AdminLogin />} />

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
