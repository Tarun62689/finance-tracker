import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button, Container, Alert } from "react-bootstrap";
import { FinanceContext } from "../FinanceContext";

const AddTransaction = () => {
  const context = useContext(FinanceContext); // ✅ Call useContext() at the top
  const navigate = useNavigate(); // ✅ Call useNavigate() at the top

  // Declare states at the top, even if context is missing
  const [transaction, setTransaction] = useState({
    amount: "",
    category: "",
    type: "expense",
    description: "",
  });

  const [success, setSuccess] = useState(false);

  // Handle missing context inside JSX instead of conditionally returning early
  if (!context) {
    console.error("FinanceContext is not available. Ensure FinanceProvider is wrapping your components.");
    return (
      <Container className="mt-4 text-center text-danger">
        <h3>Error: Finance Context not found.</h3>
      </Container>
    );
  }

  const { addTransaction } = context;

  const handleChange = (e) => {
    setTransaction({ ...transaction, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Trim inputs
    const trimmedAmount = transaction.amount.trim();
    const trimmedCategory = transaction.category.trim();
    const trimmedDescription = transaction.description.trim();

    // Validate inputs
    if (!trimmedAmount || !trimmedCategory || !trimmedDescription) {
      alert("Please fill in all fields.");
      return;
    }

    if (isNaN(trimmedAmount) || parseFloat(trimmedAmount) <= 0) {
      alert("Amount must be a positive number.");
      return;
    }

    // Create transaction object
    const newTransaction = {
      ...transaction,
      amount: parseFloat(trimmedAmount),
      category: trimmedCategory,
      description: trimmedDescription,
      id: Date.now(),
    };

    if (typeof addTransaction !== "function") {
      console.error("addTransaction is not a function.");
      return;
    }

    // Add transaction
    addTransaction(newTransaction);

    // Show success message
    setSuccess(true);

    // Clear form and navigate after delay
    setTimeout(() => {
      setSuccess(false);
      setTransaction({ amount: "", category: "", type: "expense", description: "" });
      navigate("/");
    }, 1500);
  };

  return (
    <Container className="mt-4">
      <h2 className="text-center">Add Transaction</h2>

      {success && <Alert variant="success">Transaction added successfully!</Alert>}

      <Form onSubmit={handleSubmit} className="p-4 shadow rounded bg-light">
        <Form.Group className="mb-3">
          <Form.Label>Amount</Form.Label>
          <Form.Control
            type="number"
            name="amount"
            value={transaction.amount}
            onChange={handleChange}
            placeholder="Enter amount"
            min="0.01"
            step="0.01"
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Category</Form.Label>
          <Form.Select name="category" value={transaction.category} onChange={handleChange} required>
            <option value="">Select a category</option>
            <option value="Groceries">Groceries</option>
            <option value="Salary">Salary</option>
            <option value="Rent">Rent</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Utilities">Utilities</option>
            <option value="Shopping">Shopping</option>
            <option value="Others">Others</option>
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Type</Form.Label>
          <Form.Select name="type" value={transaction.type} onChange={handleChange}>
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            name="description"
            value={transaction.description}
            onChange={handleChange}
            rows={3}
            placeholder="Enter details about the transaction"
            required
          />
        </Form.Group>

        <Button variant="success" type="submit" className="w-100">
          Add Transaction
        </Button>
      </Form>
    </Container>
  );
};

export default AddTransaction;
