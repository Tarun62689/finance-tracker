import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import FinanceProvider from "./FinanceContext";

import Dashboard from './Pages/Dashboard.js';
import AddTransaction from './Pages/AddTransaction.js';
import TransactionHistory from './Pages/TransactionHistory.js';
// import Budgets from './Pages/Budgets.js';
import Reports from './Pages/Reports.js';
import NavBar from './Components/NavBar.js';
import Login from './Pages/Login.js';
import Register from './Pages/Register.js';
import Profile from "./Pages/Profile.js";

function App() {
  return (
    <FinanceProvider>
      <Router>
        <NavBar />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/add-transaction" element={<AddTransaction />} />
          <Route path="/transactions" element={<TransactionHistory />} />
          {/* <Route path="/budgets" element={<Budgets />} /> */}
          <Route path="/reports" element={<Reports />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </Router>
    </FinanceProvider>
  );
}

export default App;
