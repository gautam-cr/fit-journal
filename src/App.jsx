import React, { useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import NavbarComponent from "./components/NavbarComponent";
import DashboardPage from "./pages/DashboardPage";
import DietPage from "./pages/DietPage";
import Fit from "./pages/Fit";
import JournalPage from "./pages/JournalPage";
import LoginPage from "./pages/LoginPage";

export default function App() {
  const [user, setUser] = useState(() => { try { return JSON.parse(localStorage.getItem("loggedUser")) || null; } catch { return null; } });
  const handleLogin = (loggedUser) => {
    setUser(loggedUser);
    if (loggedUser) localStorage.setItem("loggedUser", JSON.stringify(loggedUser));
    else localStorage.removeItem("loggedUser");
  };
  return <div className="app-shell">
    <NavbarComponent user={user} onLogout={() => handleLogin(null)} />
    <main><Routes>
      <Route path="/" element={<Navigate to={user ? "/fit" : "/login"} replace />} />
      <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
      <Route path="/dashboard" element={user ? <DashboardPage user={user} /> : <Navigate to="/login" replace />} />
      <Route path="/diet" element={user ? <DietPage user={user} /> : <Navigate to="/login" replace />} />
      <Route path="/journal" element={user ? <JournalPage user={user} /> : <Navigate to="/login" replace />} />
      <Route path="/fit" element={user ? <Fit user={user} /> : <Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to={user ? "/fit" : "/login"} replace />} />
    </Routes></main>
  </div>;
}
