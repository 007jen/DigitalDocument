import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Employee from "./pages/Employee";
import Admin from "./pages/Admin";
import Manager from "./pages/Manager";
import Layout from "./components/Layout";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes without Layout */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Protected Routes wrapped in Layout */}
        <Route path="/employee" element={<Layout><Employee /></Layout>} />
        <Route path="/admin" element={<Layout><Admin /></Layout>} />
        <Route path="/manager" element={<Layout><Manager /></Layout>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;