import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useState, useEffect } from "react";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Devices from "./pages/Devices";
import Automations from "./pages/Automations";
import Navbar from "./components/Navbar";
import { authAPI } from "./api/api";
import "./App.css";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const res = await authAPI.getMe();
          setUser(res.data);
        } catch {
          localStorage.removeItem("token");
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  const handleLogin = (token, userData) => {
    localStorage.setItem("token", token);
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={user ? <Navigate to="/" /> : <Login onLogin={handleLogin} />}
        />
        <Route
          path="/"
          element={
            user ? (
              <>
                <Navbar user={user} onLogout={handleLogout} />
                <Dashboard />
              </>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/devices"
          element={
            user ? (
              <>
                <Navbar user={user} onLogout={handleLogout} />
                <Devices />
              </>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/automations"
          element={
            user ? (
              <>
                <Navbar user={user} onLogout={handleLogout} />
                <Automations />
              </>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
