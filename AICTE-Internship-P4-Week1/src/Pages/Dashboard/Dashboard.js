import { display } from "@mui/system";
import { useState, useEffect } from "react";
import { Container, Row, Col, Button, Card, Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Toast options extracted for reuse
const toastOptions = {
  position: "bottom-right",
  autoClose: 2000,
  theme: "dark",
};

// Sample transactions for display
const transactions = [
  { id: 1, type: "credit", amount: 4500, category: "Salary", date: "2024-04-10" },
  { id: 2, type: "expense", amount: 200, category: "Groceries", date: "2024-04-09" },
  { id: 3, type: "expense", amount: 150, category: "Transport", date: "2024-04-08" },
  { id: 4, type: "credit", amount: 1200, category: "Freelance", date: "2024-04-07" },
  { id: 5, type: "expense", amount: 600, category: "Shopping", date: "2024-04-06" },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("user"))); // Get user directly from localStorage

  useEffect(() => {
    if (!user) {
      navigate("/login"); // Redirect if no user found
    }
  }, [user, navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user"); // Clear user data from localStorage
    toast.success("Logout Successful!", toastOptions); // Show success toast
    navigate("/login"); // Redirect to login page
  };

  if (!user) return null; // Early return while user data is being fetched

  // Calculate total income and expenses
  const totalIncome = transactions
    .filter((transaction) => transaction.type === "credit")
    .reduce((acc, transaction) => acc + transaction.amount, 0);

  const totalExpense = transactions
    .filter((transaction) => transaction.type === "expense")
    .reduce((acc, transaction) => acc + transaction.amount, 0);

  const totalBalance = totalIncome - totalExpense;

  return (
    <div style={styles.dashboardPage}>
      <Container style={styles.dashboardContainer}>
        <Row>
          <Col md={8} className="mx-auto">
            <Card style={styles.dashboardCard}>
              <Card.Body>
                <h2 style={styles.header}>Welcome Back</h2>
                <p style={styles.subHeader}>This is your financial dashboard.</p>

                <Row>
                  <Col sm={4}>
                    <Card style={styles.card}>
                      <Card.Body>
                        <h5>Total Income</h5>
                        <p style={styles.amount}>${totalIncome}</p>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col sm={4}>
                    <Card style={styles.card}>
                      <Card.Body>
                        <h5>Total Expenses</h5>
                        <p style={styles.amount}>${totalExpense}</p>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col sm={4}>
                    <Card style={styles.card}>
                      <Card.Body>
                        <h5>Account Balance</h5>
                        <p style={styles.amount}>${totalBalance}</p>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>

                <h3 style={styles.transactionHeader}>Recent Transactions</h3>
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>Type</th>
                      <th>Amount</th>
                      <th>Category</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((transaction) => (
                      <tr key={transaction.id}>
                        <td>{transaction.type}</td>
                        <td>{transaction.amount}</td>
                        <td>{transaction.category}</td>
                        <td>{transaction.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>

                <Button onClick={handleLogout} style={styles.logoutBtn}>
                  Logout
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <ToastContainer />
      </Container>
    </div>
  );
};

// Styles using a CSS-in-JS approach
const styles = {
  dashboardPage: {
    background: "linear-gradient(135deg, #1b1b1b, #252525)",
  },

  dashboardCard: {
    position:"relative",
    top:"20px",
    right:"30px",
    Height:"90px",
    width:"900px",
    background: "rgba(255, 255, 255, 0.1)",
    backdropFilter: "blur(10px)",
    borderRadius: "30px",
    boxShadow: "0 4px 30px rgba(210, 52, 52, 0.1)",
    textAlign: "center",
    border: "none",
  },
  header: {
    color: "#ffcc00",
    fontSize: "2rem",
    marginBottom: "1rem",
  },
  subHeader: {
    color: "#ccc",
    marginBottom: "2rem",
  },
  card: {
    background: "#fff",
    borderRadius: "40px",
    padding: "1rem",
    marginBottom: "1rem",
    textAlign: "center",
  },
  amount: {
    fontSize: "1.5rem",
    color: "#28a745",
    fontWeight: "bold",
  },
  transactionHeader: {
    color: "#ffcc00",
    fontSize: "1.5rem",
    marginTop: "2rem",
    marginBottom: "1rem",
  },
  logoutBtn: {
    width: "100%",
    background: "#ffcc00",
    border: "none",
    padding: "10px",
    fontSize: "18px",
    fontWeight: "bold",
    borderRadius: "10px",
    transition: "0.3s",
    cursor: "pointer",
  },
  
};

export default Dashboard;
