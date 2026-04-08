import React, { useState, useEffect } from "react";
import axios from "axios";

export default function Manager() {
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(false);
  const managerId = localStorage.getItem("userId") || 2; // fallback

  const fetchPending = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/api/documents/pending");
      setPending(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPending();
  }, []);

  const reviewDoc = async (id, status) => {
    try {
      await axios.put(`http://localhost:5000/api/documents/review/${id}`, {
        status,
        manager_id: managerId
      });
      fetchPending();
    } catch (e) {
      console.error(e);
      alert("Failed to review document");
    }
  };

  return (
    <div className="container-fluid">
      <h2>Manager Dashboard 💼</h2>
      <p className="text-muted mb-4">Review and approve pending employee documents.</p>

      <div className="glass-panel floating-card">
        <h5 className="mb-4 fw-bold">Action Required ({pending.length})</h5>

        {loading ? (
          <div className="text-center p-5">Loading documents...</div>
        ) : pending.length === 0 ? (
          <div className="text-center text-muted p-5">
            <h5>All Caught Up!</h5>
            <p>There are no pending documents waiting for your review.</p>
          </div>
        ) : (
          <div className="row g-4">
            {pending.map(doc => (
              <div className="col-md-6 col-xl-4" key={doc.id}>
                <div className="card border-0 shadow-sm rounded-4 h-100 transition-hover" style={{ backgroundColor: 'rgba(255,255,255,0.8)' }}>
                  <div className="card-body p-4">
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <div>
                        <div className="badge bg-warning text-dark rounded-pill mb-2 px-3">Pending</div>
                        <h5 className="fw-bold mb-1">{doc.title || "Untitled Document"}</h5>
                        <p className="text-muted small mb-0">By: {doc.username}</p>
                      </div>
                      <div className="display-6 text-primary opacity-25">📄</div>
                    </div>

                    <div className="bg-light p-2 rounded mb-4 text-truncate small text-muted" title={doc.filename}>
                      📂 {doc.filename.substring(14)}
                    </div>

                    <div className="d-flex gap-2 mb-3">
                      <button
                        className="btn btn-success flex-grow-1 fw-bold shadow-sm"
                        onClick={() => reviewDoc(doc.id, "Approved")}
                      >
                        ✓ Approve
                      </button>
                      <button
                        className="btn btn-outline-danger flex-grow-1 fw-bold"
                        onClick={() => reviewDoc(doc.id, "Rejected")}
                      >
                        ✕ Reject
                      </button>
                    </div>

                    <a
                      href={`http://localhost:5000/uploads/${doc.filename}`}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-sm btn-light w-100 border text-primary fw-bold"
                    >
                      👁 View Document Preview
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}