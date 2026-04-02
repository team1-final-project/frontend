import React from "react";
import { AuthProvider } from "./context/AuthContext";
import AuthTestPage from "./test/AuthTestPage";

function App() {
  return (
    <AuthProvider>
      <AuthTestPage />
    </AuthProvider>
  );
}

export default App;