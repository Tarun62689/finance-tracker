import React, { createContext, useState, useEffect } from "react";

export const FinanceContext = createContext();

const FinanceProvider = ({ children }) => {
  const [transactions, setTransactions] = useState([]);
  const [budget, setBudget] = useState(0);

  // Load from localStorage on mount
  useEffect(() => {
    const savedTransactions = JSON.parse(localStorage.getItem("transactions")) || [];
    const savedBudget = JSON.parse(localStorage.getItem("budget")) || 0;

    setTransactions(savedTransactions);
    setBudget(savedBudget);
  }, []);

  // Sync to localStorage when transactions or budget change
  useEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(transactions));
    localStorage.setItem("budget", JSON.stringify(budget));
  }, [transactions, budget]);

  // Fix: Add addTransaction function
  const addTransaction = (transaction) => {
    setTransactions((prev) => [...prev, transaction]);
  };

  return (
    <FinanceContext.Provider value={{ transactions, setTransactions, budget, setBudget, addTransaction }}>
      {children}
    </FinanceContext.Provider>
  );
};

export default FinanceProvider;
