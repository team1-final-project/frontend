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
import ProductDetailPage from "./pages/consumer/ProductDetailPage";
import CartPage from "./pages/consumer/CartPage";
import CheckoutPage from "./pages/consumer/CheckoutPage";
import PaymentSuccessPage from "./pages/consumer/PaymentSuccessPage";
import PaymentFailPage from "./pages/consumer/PaymentFailPage";
import OrderCompletePage from "./pages/consumer/OrderCompletePage";

import Dashboard from "./pages/admin/Dashboard";
import ProductList from "./pages/admin/products/ProductList";
import ProductRegist from "./pages/admin/products/ProductRegist";
import ProductManage from "./pages/admin/products/ProductManage";
import ProductUpdate from "./pages/admin/products/ProductUpdate";
import PriceSearch from "./pages/admin/price/PriceSearch";
import MatchingManage from "./pages/admin/price/MatchingManage";
import AIHistory from "./pages/admin/price/AIHistory";
import LiveInventory from "./pages/admin/inventory/LiveInventory";
import InventoryHistory from "./pages/admin/inventory/InventoryHistory";
import SalesStat from "./pages/admin/statistics/SalesStat";
import HeatmapStat from "./pages/admin/statistics/HeatmapStat";
import PriceTrendStat from "./pages/admin/statistics/PriceTrendStat";
import AdminManage from "./pages/admin/management/AdminManage";
import Settings from "./pages/admin/management/Settings";
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
            <Route path="/order-complete" element={<OrderCompletePage />} />
          </Route>

          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          <Route path="/payment/success" element={<PaymentSuccessPage />} />
          <Route path="/payment/fail" element={<PaymentFailPage />} />

          <Route path="/admin" element={<AdminLayout />}>
            <Route path="/admin" element={<Dashboard />} />
            <Route path="/admin/product-list" element={<ProductList />} />
            <Route path="/admin/product-regist" element={<ProductRegist />} />
            <Route
              path="/admin/product-update/:productCode"
              element={<ProductUpdate />}
            />
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
