import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import axios from "axios";
import RegistrationForm from "./Components/RegistrationForm/RegistrationForm";
import LoginForm from "./Components/LoginForm/LoginForm";
import Navigation from "./Components/Navigation/Navigation";
import Dashboard from "./Components/Dashboard/Dashboard";
import ViewUsers from "./Admin/UserNav/ViewUsers";
import DashBoardCashier from "./Components/Dashboard/DashBoardCashier";
import Products from "./Admin/Products/Products";
import Discount from "./Admin/Discount/Discount";
import Reports from "./Admin/Reports/Reports";
import CashierReport from "./Cashier/CashierReport";

function App() {
  const [isLogin, setIsLogin] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState([]);

  // Check if the user is logged in on component mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedIsAdmin = localStorage.getItem("isAdmin");
    const storedUser = localStorage.getItem("user");

    if (token) {
      setIsLogin(true);
      setIsAdmin(storedIsAdmin === "true");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    }
  }, []);

  const handleLogin = (userData) => {
    setIsLogin(true);
    localStorage.setItem("token", "your_token_here");
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("isAdmin", userData.role === "Admin");
  };

  const handleLogout = async () => {
    localStorage.removeItem("token");
    localStorage.removeItem("isAdmin");
    localStorage.removeItem("user");
    setIsLogin(false);
    setIsAdmin(false);

    try {
      await axios.post("logout", { userId: user.id });
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  // Define a new function to set the user data
  const handleSetUser = (userData) => {
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  const handleRole = (role) => {
    setIsAdmin(role === "Admin");
    localStorage.setItem("isAdmin", role === "Admin");
  };

  return (
    <Router>
      <div className="App">
        <div className="wrapper">
          {isLogin && <Navigation onLogout={handleLogout} isAdmin={isAdmin} />}
          <Routes>
            <Route path="/registration" element={<RegistrationForm />} />
            {!isLogin ? (
              <Route
                path="/"
                element={
                  <LoginForm
                    isLogin={handleLogin}
                    isRole={handleRole}
                    setGetUser={handleSetUser} // Pass handleSetUser here
                  />
                }
              />
            ) : (
              <>
                {isAdmin ? (
                  <>
                    <Route path="/users" element={<ViewUsers />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/products" element={<Products />} />
                    <Route path="/discount" element={<Discount />} />
                    <Route path="/reports" element={<Reports />} />
                  </>
                ) : (
                  <>
                    <Route
                      path="/dashboard"
                      element={<DashBoardCashier user={user} />}
                    />
                    <Route
                      path="/reports"
                      element={<CashierReport user={user} />}
                    />
                  </>
                )}
              </>
            )}
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
