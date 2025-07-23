import React, { useContext } from "react";
import { Container, Row, Col, Card, Table } from "react-bootstrap";
import { Pie } from "react-chartjs-2";
import { FinanceContext } from "../FinanceContext";

const Dashboard = () => {
  const { transactions } = useContext(FinanceContext);

  // Format currency properly
  const formatCurrency = (amount) => 
    `₹${Number(amount || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;

  // Format date properly
  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Intl.DateTimeFormat("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(new Date(date));
  };

  // Calculate total income & expenses separately
  const totalIncome = transactions
    .filter((tx) => tx.type === "income")
    .reduce((sum, tx) => sum + Number(tx.amount || 0), 0);

  const totalExpenses = transactions
    .filter((tx) => tx.type === "expense")
    .reduce((sum, tx) => sum + Number(tx.amount || 0), 0);

  const totalBalance = totalIncome - totalExpenses;

  // Calculate category-wise totals for expenses only
  const categoryTotals = transactions
    .filter((tx) => tx.type === "expense")
    .reduce((acc, tx) => {
      const amount = Number(tx.amount || 0);
      acc[tx.category] = (acc[tx.category] || 0) + amount;
      return acc;
    }, {});

  // Sort transactions by date (assuming tx.date is in YYYY-MM-DD format)
  const sortedTransactions = [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date));

  // Chart Data
  const chartData = {
    labels: Object.keys(categoryTotals),
    datasets: [
      {
        data: Object.values(categoryTotals),
        backgroundColor: [
          "#ff6384", "#36a2eb", "#ffce56", "#4caf50", "#8e44ad",
          "#f39c12", "#e74c3c", "#3498db", "#2ecc71", "#d35400"
        ],
      },
    ],
  };

  return (
    <Container className="mt-4">
      <Row>
        {/* Balance & Income/Expense Overview */}
        <Col md={6}>
          <Card className="mb-3 shadow">
            <Card.Body>
              <Card.Title className="fw-bold">Total Balance</Card.Title>
              <h3 className={totalBalance >= 0 ? "text-success" : "text-danger"}>
                {formatCurrency(totalBalance)}
              </h3>
              <p className="text-success fw-semibold">Income: {formatCurrency(totalIncome)}</p>
              <p className="text-danger fw-semibold">Expenses: {formatCurrency(totalExpenses)}</p>
            </Card.Body>
          </Card>

          {/* Pie Chart for Expense Breakdown */}
          <Card className="shadow">
            <Card.Body>
              <Card.Title className="fw-bold">Spending Breakdown</Card.Title>
              {Object.keys(categoryTotals).length > 0 ? (
                <div className="d-flex justify-content-center">
                  <Pie data={chartData} />
                </div>
              ) : (
                <p className="text-muted text-center">No spending data available</p>
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* Recent Transactions Table */}
        <Col md={6}>
          <Card className="shadow">
            <Card.Body>
              <Card.Title className="fw-bold">Recent Transactions</Card.Title>
              {transactions.length > 0 ? (
                <Table striped bordered hover responsive>
                  <thead className="table-dark text-center">
                    <tr>
                      <th>Date</th>
                      <th>Category</th>
                      <th>Type</th>
                      <th>Amount</th>
                    </tr>
                  </thead>
                  <tbody className="text-center">
                    {sortedTransactions.slice(0, 5).map((tx) => (
                      <tr key={tx.id}>
                        <td>{formatDate(tx.date)}</td>
                        <td>{tx.category || "Uncategorized"}</td>
                        <td className={tx.type === "income" ? "text-success" : "text-danger"}>
                          {tx.type.charAt(0).toUpperCase() + tx.type.slice(1)}
                        </td>
                        <td className="fw-semibold">{formatCurrency(tx.amount)}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <p className="text-muted text-center">No transactions available</p>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;
