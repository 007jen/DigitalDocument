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
    <div className="d-flex align-items-center justify-content-center" style={{ minHeight: "100vh" }}>
      <div className="col-11 col-sm-8 col-md-6 col-lg-4">
        <div className="glass-panel text-center floating-card">
          {/* <h2 className="mb-4">Welcome Back</h2> */}
          <p className="text-muted mb-4 small">Select your role and login to continue</p>

          <div className="d-flex flex-column gap-2 mb-4">
            <button
              className={`btn ${role === 'employee' ? 'btn-primary shadow flex-grow-1' : 'btn-light border'} fw-bold`}
              onClick={() => setRole("employee")}
            >
              Employee
            </button>
            <button
              className={`btn ${role === 'manager' ? 'btn-warning shadow flex-grow-1 text-dark' : 'btn-light border'} fw-bold`}
              onClick={() => setRole("manager")}
            >
              Manager
            </button>
            <button
              className={`btn ${role === 'admin' ? 'btn-success shadow flex-grow-1' : 'btn-light border'} fw-bold`}
              onClick={() => setRole("admin")}
            >
              Admin
            </button>
          </div>

          <div className="text-start">
            <label className="form-label text-muted small fw-bold mt-2">EMAIL ADDRESS</label>
            <input
              type="email"
              className="form-control mb-3"
              placeholder="name@company.com"
              onChange={(e) => setEmail(e.target.value)}
            />

            <label className="form-label text-muted small fw-bold">PASSWORD</label>
            <input
              type="password"
              className="form-control mb-4"
              placeholder="••••••••"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button className="btn btn-dark w-100 py-2 fw-bold" onClick={login}>
            Secure Login
          </button>

          <p className="mt-4 mb-0 text-muted small">
            New to the system? <a href="/register" className="fw-bold text-primary text-decoration-none">Register here</a>
          </p>
        </div>
      </div>
    </div>
  );
}