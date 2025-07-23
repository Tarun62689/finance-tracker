import React, { useEffect, useState } from "react";
import { Container, Table, Alert } from "react-bootstrap";

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    // Fetch transactions from localStorage
    const savedTransactions = JSON.parse(localStorage.getItem("transactions")) || [];
    setTransactions(savedTransactions);
  }, []);

  return (
    <Container className="mt-4">
      <h2 className="text-center">Transaction History</h2>

      {/* If no transactions, show alert */}
      {transactions.length === 0 ? (
        <Alert variant="info" className="text-center mt-3">
          No transactions found. Add some transactions first.
        </Alert>
      ) : (
        <Table striped bordered hover className="mt-3 shadow-sm">
          <thead className="bg-dark text-white">
            <tr>
              <th>#</th>
              <th>Amount</th>
              <th>Category</th>
              <th>Type</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>₹{transaction.amount}</td>
                <td>{transaction.category}</td>
                <td className={transaction.type === "income" ? "text-success" : "text-danger"}>
                  {transaction.type.toUpperCase()}
                </td>
                <td>{transaction.description}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default TransactionHistory;
