import { useCallback, useEffect, useReducer, useState } from "react";
import { Container, Row, Col, Form, Button, Spinner } from "react-bootstrap";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { loginAPI } from "../../utils/ApiRequest";

const initialState = { email: "", password: "" };

const reducer = (state, action) => {
  return { ...state, [action.field]: action.value };
};

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [state, dispatch] = useReducer(reducer, initialState);

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

  const handleChange = (e) => {
    dispatch({ field: e.target.name, value: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = state;

    if (!email || !password) {
      toast.error("Please fill all fields", toastOptions);
      return;
    }

    setLoading(true);
    try {
      const { data } = await axios.post(loginAPI, { email, password });

      if (data.success) {
        localStorage.setItem("user", JSON.stringify(data.user));
        toast.success("Login Successful! Redirecting...", toastOptions);
        setTimeout(() => navigate("/home"), 1500);
      } else {
        toast.error(data.message, toastOptions);
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.", toastOptions);
    } finally {
      setLoading(false);
    }
  };

  const particlesInit = useCallback(async (engine) => {
    await loadFull(engine);
  }, []);

  return (
    <div style={styles.loginPage}>
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={{
          background: { color: { value: "#1b1b1b" } },
          particles: {
            number: { value: 100, density: { enable: true, value_area: 800 } },
            color: { value: "#ffcc00" },
            shape: { type: "circle" },
            move: { enable: true, speed: 2 },
          },
          detectRetina: true,
        }}
        style={styles.particlesBg}
      />

      <Container style={styles.loginContainer}>
        <Row>
          <Col md={{ span: 6, offset: 3 }}>
            <div style={styles.loginCard}>
              <h1 className="text-center">
                <AccountBalanceWalletIcon sx={{ fontSize: 50, color: "#ffcc00" }} />
              </h1>
              <h2 style={{ color: "white", textAlign: "center" }}>Welcome Back</h2>
              <p style={{ color: "#ccc", textAlign: "center" }}>Login to your account</p>

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mt-3">
                  <Form.Label style={{ color: "white" }}>Email address</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter your email"
                    name="email"
                    onChange={handleChange}
                    value={state.email}
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
                    value={state.password}
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
                  style={styles.loginBtn}
                  disabled={loading}
                  className="mt-3"
                >
                  {loading ? <Spinner animation="border" size="sm" /> : "Login"}
                </Button>

                <p className="mt-3 text-center" style={{ color: "#ccc" }}>
                  Don't Have an Account?{" "}
                  <Link to="/register" style={{ color: "#ffcc00" }}>
                    Register
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

// Embedded CSS as JS object
const styles = {
  loginPage: {
    position: "relative",
    height: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #1b1b1b, #252525)",
  },
  particlesBg: {
    position: "absolute",
    zIndex: -1,
    width: "100%",
    height: "100%",
  },
  loginContainer: {
    zIndex: 1,
  },
  loginCard: {
    background: "rgba(255, 255, 255, 0.1)",
    backdropFilter: "blur(10px)",
    padding: "2rem",
    borderRadius: "15px",
    boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
    maxWidth: "400px",
    margin: "auto",
    textAlign: "center",
  },
  inputField: {
    background: "rgba(255, 255, 255, 0.2)",
    border: "none",
    color: "white",
  },
  forgotLink: {
    textDecoration: "none",
    fontSize: "14px",
    color: "#ccc",
  },
  loginBtn: {
    width: "100%",
    background: "#ffcc00",
    border: "none",
    padding: "10px",
    fontSize: "18px",
    fontWeight: "bold",
    borderRadius: "10px",
    transition: "0.3s",
  },
};

// Export the component
export default Login;
