import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import GlobalStyle from "./styles/GlobalStyle";
import theme from "./styles/theme";
import { AuthProvider } from "./context/AuthContext";
import GoogleLoginCallbackPage from "./test/GoogleLoginCallbackPage";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AuthTestPage from "./test/AuthTestPage";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <AuthProvider>
          <GlobalStyle />
          <Routes>
            <Route path="/" element={<AuthTestPage />} />
            <Route
              path="/auth/google/callback"
              element={<GoogleLoginCallbackPage />}
            />
            <Route path="*" element={<Navigate to="/" replace />} />

            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
