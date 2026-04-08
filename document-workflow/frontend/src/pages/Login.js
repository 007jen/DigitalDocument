import { useState } from "react";
import axios from "axios";

export default function Login() {
  const [role, setRole] = useState("employee"); // default role
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password
      });

      const role = res.data.role.toLowerCase();
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", role);

      // Redirect based on role
      if (role === "employee") window.location.href = "/employee";
      else if (role === "admin") window.location.href = "/admin";
      else if (role === "manager") window.location.href = "/manager";

    } catch (err) {
      alert("Login failed. Check your email/password.");
      console.error(err);
    }
  };

  return (
    <div className="container mt-5">
      <div className="card p-4 shadow">
        <h2 className="text-center mb-4">Login</h2>

        <div className="d-flex justify-content-center mb-3">
          <button className="btn btn-primary me-2" onClick={() => setRole("employee")}>Employee</button>
          <button className="btn btn-success me-2" onClick={() => setRole("admin")}>Admin</button>
          <button className="btn btn-warning" onClick={() => setRole("manager")}>Manager</button>
        </div>

        <input
          type="email"
          className="form-control mb-3"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="form-control mb-3"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="btn btn-dark w-100" onClick={login}>
          Login as {role}
        </button>

        <p className="mt-3 text-center">
          Don't have an account? <a href="/register">Register here</a>
        </p>
      </div>
    </div>
  );
}