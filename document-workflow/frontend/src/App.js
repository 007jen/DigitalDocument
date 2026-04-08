import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Employee from "./pages/Employee";
import Admin from "./pages/Admin";
import Manager from "./pages/Manager";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/employee" element={<Employee />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/manager" element={<Manager />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;