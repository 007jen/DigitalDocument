import { useState } from "react";
import axios from "axios";

export default function Register() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    role: "employee"
  });

  const register = async () => {
    try {
      await axios.post("http://localhost:5000/api/auth/register", form);
      alert("Registered successfully!");
      window.location.href = "/";
    } catch (err) {
      alert("Registration failed.");
      console.error(err);
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center" style={{ minHeight: "100vh" }}>
      <div className="col-11 col-sm-8 col-md-6 col-lg-4">
        <div className="glass-panel text-center floating-card">
          <h2 className="mb-4">Create Account</h2>
          <p className="text-muted mb-4 small">Fill in the details to register</p>

          <div className="text-start">
            <label className="form-label text-muted small fw-bold">USERNAME</label>
            <input
              className="form-control mb-3"
              placeholder="e.g., JaneDoe"
              onChange={(e) => setForm({ ...form, username: e.target.value })}
            />

            <label className="form-label text-muted small fw-bold">EMAIL ADDRESS</label>
            <input
              className="form-control mb-3"
              placeholder="name@company.com"
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />

            <label className="form-label text-muted small fw-bold">PASSWORD</label>
            <input
              type="password"
              className="form-control mb-3"
              placeholder="••••••••"
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />

            <label className="form-label text-muted small fw-bold">SYSTEM ROLE</label>
            <select
              className="form-select mb-4 py-2 border-0 shadow-sm"
              style={{ backgroundColor: 'rgba(255,255,255,0.9)' }}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
            >
              <option value="employee">Employee</option>
              <option value="manager">Manager</option>
              <option value="admin">System Admin</option>
            </select>
          </div>

          <button className="btn btn-primary w-100 py-2 fw-bold" onClick={register}>
            Register Account
          </button>

          <p className="mt-4 mb-0 text-muted small">
            Already have an account? <a href="/" className="fw-bold text-primary text-decoration-none">Login here</a>
          </p>
        </div>
      </div>
    </div>
  );
}