import React, { useState, useEffect, useContext } from "react";
import { Container, Row, Col, Card, Table, ProgressBar, Form, Button } from "react-bootstrap";
import axios from "axios";
import { FinanceContext } from "../FinanceContext"; // Import global finance context

const Budgets = ({ userId }) => {
  const { transactions, fetchDashboardData } = useContext(FinanceContext); // Get transactions & refresh dashboard
  const [budgets, setBudgets] = useState({});
  const [newBudget, setNewBudget] = useState({ category: "", amount: "" });

  // Fetch Budgets from MongoDB
  useEffect(() => {
    axios.get(`http://localhost:5000/api/budgets/${userId}`)
      .then((res) => {
        const budgetData = res.data.reduce((acc, budget) => {
          acc[budget.category] = budget.amount;
          return acc;
        }, {});
        setBudgets(budgetData);
      })
      .catch((err) => console.error(err));
  }, [userId]);

  // Calculate total spending per category
  const categorySpending = transactions
    .filter((tx) => tx.type === "expense")
    .reduce((acc, tx) => {
      acc[tx.category] = (acc[tx.category] || 0) + Number(tx.amount || 0);
      return acc;
    }, {});

  // Handle budget input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewBudget((prev) => ({ ...prev, [name]: value }));
  };

  // Add or Update Budget in MongoDB
  const handleAddBudget = (e) => {
    e.preventDefault();
    if (newBudget.category && newBudget.amount) {
      axios.post("http://localhost:5000/api/budgets/add", {
        userId,
        category: newBudget.category,
        amount: Number(newBudget.amount),
      })
      .then(() => {
        setBudgets((prev) => ({
          ...prev,
          [newBudget.category]: Number(newBudget.amount),
        }));
        setNewBudget({ category: "", amount: "" });
        fetchDashboardData(); // Refresh dashboard data after updating budget
      })
      .catch((err) => console.error(err));
    }
  };

  return (
    <Container className="mt-4">
      <Row>
        <Col md={6}>
          <Card className="shadow mb-3">
            <Card.Body>
              <Card.Title>Set Monthly Budget</Card.Title>
              <Form onSubmit={handleAddBudget}>
                <Form.Group>
                  <Form.Label>Category</Form.Label>
                  <Form.Control
                    type="text"
                    name="category"
                    placeholder="Enter category"
                    value={newBudget.category}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
                <Form.Group className="mt-2">
                  <Form.Label>Budget Amount (₹)</Form.Label>
                  <Form.Control
                    type="number"
                    name="amount"
                    placeholder="Enter budget"
                    value={newBudget.amount}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
                <Button type="submit" className="mt-3 w-100" variant="primary">
                  Set Budget
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card className="shadow">
            <Card.Body>
              <Card.Title>Budget Overview</Card.Title>
              {Object.keys(budgets).length === 0 ? (
                <p className="text-muted text-center">No budgets set.</p>
              ) : (
                <Table striped bordered hover responsive>
                  <thead>
                    <tr>
                      <th>Category</th>
                      <th>Budget (₹)</th>
                      <th>Spent (₹)</th>
                      <th>Progress</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.keys(budgets).map((category) => {
                      const budget = budgets[category];
                      const spent = categorySpending[category] || 0;
                      const percentage = Math.min((spent / budget) * 100, 100);
                      const variant = spent > budget ? "danger" : "success";

                      return (
                        <tr key={category}>
                          <td>{category}</td>
                          <td>₹{budget.toFixed(2)}</td>
                          <td>₹{spent.toFixed(2)}</td>
                          <td>
                            <ProgressBar
                              now={percentage}
                              label={`${percentage.toFixed(0)}%`}
                              variant={variant}
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Budgets;
