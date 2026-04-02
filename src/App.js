import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import AuthTestPage from "./test/AuthTestPage";
import GoogleLoginCallbackPage from "./test/GoogleLoginCallbackPage";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<AuthTestPage />} />
        <Route
          path="/auth/google/callback"
          element={<GoogleLoginCallbackPage />}
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;