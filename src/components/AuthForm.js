import React, { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const API_URL = process.env.REACT_APP_API_URL;

function AuthForm({onSuccess}) {
  const { login } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const endpoint = isLogin ? "/auth/login" : "/auth/signup";
      const payload = isLogin ? { email, password } : { email, password, name };

      const response = await axios.post(`${API_URL}${endpoint}`, payload, {
        withCredentials: true,
      });

      if (response.data.success) {
        setMessage("Success!");
        login(response.data.data.user, response.data.data.token);
        onSuccess(response.data.data.user, response.data.data.token);
      }
    } catch (error) {
      console.error("Axios error:", error);
      if (error.response?.data?.error) {
        setMessage(error.response.data.error);
      } else if (error.request) {
        setMessage("No response from server");
      } else {
        setMessage("Request setup error");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #89afceff 0%, #3694d3ff 100%)",
        fontFamily: "Inter, sans-serif",
      }}
    >
      <div
        style={{
          width: "360px",
          backgroundColor: "white",
          borderRadius: "20px",
          padding: "40px 30px",
          boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
          textAlign: "center",
        }}
      >
        <h2 style={{ marginBottom: "25px", color: "#333" }}>
          {isLogin ? "Welcome Back" : "Create an Account"}
        </h2>

        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "15px" }}
        >
          {!isLogin && (
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="auth-input"
            />
          )}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="auth-input"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="auth-input"
          />
          <button
            type="submit"
            disabled={loading}
            style={{
              background:
                "linear-gradient(135deg, #94bbdbff 0%, #3694d3ff 100%)",
              color: "white",
              border: "none",
              borderRadius: "8px",
              padding: "12px",
              fontWeight: "600",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? "Loading..." : isLogin ? "Login" : "Sign Up"}
          </button>
        </form>

        <p style={{ marginTop: "20px", color: "#555" }}>
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <span
            onClick={() => {
              setIsLogin(!isLogin);
              setMessage("");
            }}
            style={{ color: "#667eea", cursor: "pointer", fontWeight: "600" }}
          >
            {isLogin ? "Sign up" : "Login"}
          </span>
        </p>

        {message && (
          <p
            style={{
              marginTop: "20px",
              color: message.includes("Success") ? "green" : "red",
              fontWeight: "500",
            }}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
}

export default AuthForm;
