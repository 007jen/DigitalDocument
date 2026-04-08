import { useState, useEffect } from "react";
import axios from "axios";

export default function Manager() {
  const [pending, setPending] = useState([]);

  const fetchPending = async () => {
    const res = await axios.get("http://localhost:5000/api/documents/pending");
    setPending(res.data);
  };

  const reviewDoc = async (id, status) => {
    await axios.put(`http://localhost:5000/api/documents/review/${id}`, {status});
    fetchPending();
  };

  useEffect(()=>{ fetchPending(); }, []);

  return (
    <div className="container mt-5">
      <h2>Manager Dashboard - Pending Documents</h2>
      <table className="table table-bordered">
        <thead>
          <tr><th>Employee</th><th>File</th><th>Status</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {pending.map(doc=>(
            <tr key={doc.id}>
              <td>{doc.username}</td>
              <td>{doc.filename}</td>
              <td>{doc.status}</td>
              <td>
                <button className="btn btn-success me-2" onClick={()=>reviewDoc(doc.id,"Approved")}>Approve</button>
                <button className="btn btn-danger" onClick={()=>reviewDoc(doc.id,"Rejected")}>Reject</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}