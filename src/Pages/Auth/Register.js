import { useCallback, useEffect, useState } from "react";
import { Container, Row, Col, Form, Button, Spinner } from "react-bootstrap";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { registerAPI } from "../../utils/ApiRequest"; // Ensure API path is correct

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [values, setValues] = useState({ name: "", email: "", password: "" });

  useEffect(() => {
    if (localStorage.getItem("user")) {
      navigate("/");
    }
  }, [navigate]);

  const toastOptions = {
    position: "bottom-right",
    autoClose: 2000,
    theme: "dark",
  };

  // Password Validation Function
  const isValidPassword = (password) => {
    return password.length >= 8 && /\d/.test(password) && /[A-Z]/.test(password);
  };

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { name, email, password } = values;

    // Validate Password Strength
    if (!isValidPassword(password)) {
      toast.error(
        "Password must be at least 8 characters long, include an uppercase letter and a number.",
        toastOptions
      );
      setLoading(false);
      return;
    }

    try {
      const { data } = await axios.post(registerAPI, { name, email, password });

      if (data.success) {
        localStorage.setItem("user", JSON.stringify(data.user));
        toast.success("Registration Successful! Redirecting...", toastOptions);
        setTimeout(() => navigate("/"), 1500);
      } else {
        toast.error(data.message, toastOptions);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong. Please try again.", toastOptions);
    } finally {
      setLoading(false);
    }
  };

  const particlesInit = useCallback(async (engine) => {
    await loadFull(engine);
  }, []);

  return (
    <div style={styles.signupPage}>
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={{
          background: { color: { value: "#0A192F" } }, // Dark blue theme
          particles: {
            number: { value: 100, density: { enable: true, value_area: 800 } },
            color: { value: ["#FFD700", "#21BF73"] }, // Gold & Green for finance
            shape: { type: "circle" },
            move: { enable: true, speed: 2 },
          },
          detectRetina: true,
        }}
        style={styles.particlesBg}
      />

      <Container style={styles.signupContainer}>
        <Row>
          <Col md={{ span: 6, offset: 3 }}>
            <div style={styles.signupCard}>
              <h1 className="text-center">
                <AccountBalanceWalletIcon sx={{ fontSize: 50, color: "#FFD700" }} />
              </h1>
              <h2 style={{ color: "#FFD700", textAlign: "center" }}>Sign Up</h2>
              <p style={{ color: "#B2B2B2", textAlign: "center" }}>
                Join the Finance Management System today!
              </p>

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mt-3">
                  <Form.Label style={{ color: "white" }}>Full Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    placeholder="Enter your name"
                    onChange={handleChange}
                    value={values.name}
                    required
                    style={styles.inputField}
                  />
                </Form.Group>

                <Form.Group className="mt-3">
                  <Form.Label style={{ color: "white" }}>Email Address</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    onChange={handleChange}
                    value={values.email}
                    required
                    style={styles.inputField}
                  />
                </Form.Group>

                <Form.Group className="mt-3">
                  <Form.Label style={{ color: "white" }}>Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    placeholder="Enter password"
                    onChange={handleChange}
                    value={values.password}
                    required
                    style={styles.inputField}
                  />
                </Form.Group>

                <div className="text-center mt-3">
                  <Link to="/forgotPassword" style={styles.forgotLink}>
                    Forgot Password?
                  </Link>
                </div>

                <Button
                  type="submit"
                  style={styles.signupBtn}
                  disabled={loading}
                  className="mt-3 signupBtn"
                >
                  {loading ? <Spinner animation="border" size="sm" /> : "Sign Up"}
                </Button>

                <p className="mt-3 text-center" style={{ color: "#B2B2B2" }}>
                  Already have an account?{" "}
                  <Link to="/login" style={{ color: "#FFD700" }}>
                    Login
                  </Link>
                </p>
              </Form>
            </div>
          </Col>
        </Row>
        <ToastContainer />
      </Container>
    </div>
  );
};

// CSS Styles
const styles = {
  signupPage: {
    position: "relative",
    height: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #0A192F, #021224)",
  },
  particlesBg: {
    position: "absolute",
    zIndex: -1,
    width: "100%",
    height: "100%",
  },
  signupContainer: {
    zIndex: 1,
  },
  signupCard: {
    background: "rgba(0, 0, 0, 0.6)",
    backdropFilter: "blur(10px)",
    padding: "2rem",
    borderRadius: "15px",
    boxShadow: "0 4px 30px rgba(0, 0, 0, 0.3)",
    maxWidth: "400px",
    margin: "auto",
    textAlign: "center",
  },
  inputField: {
    background: "rgba(255, 255, 255, 0.2)",
    border: "none",
    color: "white",
    padding: "10px",
  },
  forgotLink: {
    textDecoration: "none",
    fontSize: "14px",
    color: "#B2B2B2",
  },
  signupBtn: {
    width: "100%",
    background: "#21BF73",
    border: "none",
    padding: "10px",
    fontSize: "18px",
    fontWeight: "bold",
    borderRadius: "10px",
    transition: "0.3s",
    cursor: "pointer",
  },
};

export default Register;
