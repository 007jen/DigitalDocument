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
    <div className="container mt-5">
      <div className="card p-4 shadow">
        <h2 className="text-center mb-4">Register</h2>

        <input
          className="form-control mb-2"
          placeholder="Username"
          onChange={(e) => setForm({ ...form, username: e.target.value })}
        />

        <input
          className="form-control mb-2"
          placeholder="Email"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <input
          type="password"
          className="form-control mb-2"
          placeholder="Password"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <select
          className="form-control mb-2"
          onChange={(e) => setForm({ ...form, role: e.target.value })}
        >
          <option value="employee">Employee</option>
          <option value="admin">Admin</option>
          <option value="manager">Manager</option>
        </select>

        <button className="btn btn-success w-100" onClick={register}>
          Register
        </button>

        <p className="mt-3 text-center">
          Already have an account? <a href="/">Login here</a>
        </p>
      </div>
    </div>
  );
}