

import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import About from "./components/about";
import Example from "./components/footer";
import Hero from "./components/hero";
import LoginPopup from "./components/LoginPopup";
import Chat from "./components/Chat";
import PricingPage from "./components/PricingPage";
import { supabase } from "./lib/supabase";

// Protected route component
const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase.auth.getUser(token);
        if (!error && data?.user) {
          setAuthenticated(true);
        } else {
          localStorage.removeItem("token");
          setAuthenticated(false);
        }
      } catch (err) {
        // Fallback check if token exists
        setAuthenticated(!!token);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) return <div>Loading...</div>;

  if (!authenticated) {
    navigate("/");
    return null;
  }

  return children;
};

export default function App() {
  const [showLogin, setShowLogin] = useState(false);
  const navigate = useNavigate();

  const handleGetStarted = () => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/chat");
    } else {
      setShowLogin(true);
    }
  };

  return (
    <Routes>
      <Route path="/" element={
        <div>
          <Hero onGetStarted={handleGetStarted} />
          <About />
          <Example />
          <LoginPopup isOpen={showLogin} onClose={() => setShowLogin(false)} />
        </div>
      } />
      <Route path="/chat" element={
        <ProtectedRoute>
          <Chat />
        </ProtectedRoute>
      } />
      <Route path="/upgrade" element={<PricingPage />} />
    </Routes>
  );
}