import { useEffect, useState } from "react";
import axios from "axios";

export default function Admin() {
  const [docs, setDocs] = useState([]);

  useEffect(() => {
    const fetchDocs = async () => {
      const res = await axios.get("http://localhost:5000/api/documents", {
        headers: { Authorization: localStorage.getItem("token") }
      });
      setDocs(res.data);
    };
    fetchDocs();
  }, []);

  return (
    <div className="container mt-5">
      <h2>Admin Dashboard 👑</h2>

      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Title</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {docs.map((d) => (
            <tr key={d.id}>
              <td>{d.title}</td>
              <td>{d.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}