import React, { useState, useEffect } from "react";
import axios from "axios";

export default function Admin() {
  const [docs, setDocs] = useState([]);
  const [activeTab, setActiveTab] = useState("documents");
  const [loading, setLoading] = useState(false);
  const [rejectingStates, setRejectingStates] = useState({}); // For admin override rejection inline prompt
  const adminId = localStorage.getItem("userId") || 1;

  const fetchDocs = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/api/documents");
      setDocs(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocs();
  }, [activeTab]);

  const initiateReject = (docId) => setRejectingStates(prev => ({ ...prev, [docId]: "" }));
  const cancelReject = (docId) => setRejectingStates(prev => { const updated = {...prev}; delete updated[docId]; return updated; });
  const handleReasonChange = (docId, value) => setRejectingStates(prev => ({ ...prev, [docId]: value }));

  const reviewDocOverride = async (id, status) => {
    let reason = null;
    if (status === "Rejected") {
      reason = rejectingStates[id];
      if (!reason || reason.trim() === "") return alert("Please enter rejection reason.");
    }
    
    // Ensure admin actually wants to override
    const confirmText = status === "Approved" ? "FORCE APPROVE this document?" : "FORCE REJECT this document?";
    if(!window.confirm(`ADMIN OVERRIDE: Are you sure you want to ${confirmText}`)) return;

    try {
      await axios.put(`http://localhost:5000/api/documents/review/${id}`, {
        status, 
        manager_id: adminId,
        reason
      });
      cancelReject(id);
      fetchDocs();
    } catch(e) {
      console.error(e);
      alert("Failed to override document status");
    }
  };

  // Flatten the AuditLog history from all docs to create a global Audit list
  const auditLogs = docs
    .flatMap(doc => doc.AuditLogs.map(log => ({
      ...log,
      docTitle: doc.title,
      docId: doc.id
    })))
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return (
    <div className="container-fluid">
      <h2>System Administration ⚙️</h2>
      <p className="text-muted mb-4">Complete oversight and Admin Overrides.</p>

      {/* Tabs */}
      <ul className="nav nav-pills mb-4" style={{ gap: '0.5rem' }}>
        <li className="nav-item">
          <button 
            className={`nav-link fw-bold ${activeTab === 'documents' ? 'active shadow-sm' : 'text-muted'}`} 
            onClick={() => setActiveTab('documents')}
          >
            All Documents
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-link fw-bold ${activeTab === 'audit' ? 'active shadow-sm' : 'text-muted'}`} 
            onClick={() => setActiveTab('audit')}
          >
            System Audit Trail
          </button>
        </li>
      </ul>

      <div className="glass-panel floating-card">
        {loading ? (
          <div className="text-center p-5 text-muted">Gathering system data...</div>
        ) : activeTab === 'documents' ? (
          /* Documents Tab */
          <div>
            <h5 className="mb-4 fw-bold">All Documents (Admin Override)</h5>
            <div className="row g-4">
              {docs.map(doc => {
                const isRejecting = rejectingStates[doc.id] !== undefined;
                return (
                  <div className="col-12 col-xl-6" key={doc.id}>
                    <div className="card shadow-sm border-0 h-100 rounded-4" style={{ backgroundColor: 'rgba(255,255,255,0.85)' }}>
                      <div className="card-body d-flex flex-column">
                        <div className="d-flex justify-content-between">
                          <h5 className="fw-bold mb-0 text-truncate me-3">{doc.title}</h5>
                          <span className={`badge bg-${doc.status === 'Approved' ? 'success' : doc.status === 'Rejected' ? 'danger' : 'warning text-dark'} px-3 d-flex align-items-center`}>
                            {doc.status}
                          </span>
                        </div>
                        <p className="small text-muted mb-3 mt-1">Uploaded by EmployeeID: {doc.employee_id} | {new Date(doc.createdAt).toLocaleDateString()}</p>
                        
                        {doc.status === 'Rejected' && doc.rejection_reason && (
                           <div className="alert alert-danger small p-2 mb-3 shadow-sm border-0 border-start border-danger border-4">
                             <strong>Previous Rejection Reason:</strong> {doc.rejection_reason}
                           </div>
                        )}

                        <div className="mt-auto pt-3 border-top d-flex flex-wrap gap-2 align-items-center">
                          <a href={`http://localhost:5000/uploads/${doc.filename}`} target="_blank" rel="noreferrer" className="btn btn-sm btn-light border text-primary fw-bold px-3">
                            👁 Preview
                          </a>
                          
                          {/* Admin Override Controls */}
                          <div className="ms-auto d-flex gap-2 align-items-center">
                            {isRejecting ? (
                              <div className="d-flex gap-2 align-items-center" style={{ minWidth: '300px' }}>
                                <input type="text" className="form-control form-control-sm border-danger" placeholder="Override Rejection Reason" value={rejectingStates[doc.id]} onChange={(e) => handleReasonChange(doc.id, e.target.value)} />
                                <button className="btn btn-sm btn-danger fw-bold" onClick={() => reviewDocOverride(doc.id, "Rejected")}>Confirm</button>
                                <button className="btn btn-sm btn-secondary" onClick={() => cancelReject(doc.id)}>✕</button>
                              </div>
                            ) : (
                              <>
                                <button className="btn btn-sm btn-outline-success fw-bold" onClick={() => reviewDocOverride(doc.id, "Approved")}>
                                  Override Approve
                                </button>
                                <button className="btn btn-sm btn-outline-danger fw-bold" onClick={() => initiateReject(doc.id)}>
                                  Override Reject
                                </button>
                              </>
                            )}
                          </div>
                        </div>

                      </div>
                    </div>
                  </div>
                );
              })}
              {docs.length === 0 && <div className="p-4 text-center">No documents in system.</div>}
            </div>
          </div>
        ) : (
          /* Audit Trail Tab */
          <div>
            <h5 className="mb-4 fw-bold">Global Audit Trail Report</h5>
            <div className="table-responsive">
              <table className="table table-hover align-middle bg-white rounded shadow-sm overflow-hidden">
                <thead className="bg-light">
                  <tr>
                    <th>Date & Time</th>
                    <th>Action</th>
                    <th>Document</th>
                    <th>Executed By</th>
                    <th>Details</th>
                  </tr>
                </thead>
                <tbody>
                  {auditLogs.map(log => (
                    <tr key={log.id}>
                      <td className="text-muted small w-25">
                        {new Date(log.createdAt).toLocaleString()}
                      </td>
                      <td>
                        <span className={`badge bg-${log.action === 'Approved' ? 'success' : log.action === 'Rejected' ? 'danger' : 'primary'} px-3 py-1`}>
                          {log.action}
                        </span>
                      </td>
                      <td className="fw-bold">{log.docTitle}</td>
                      <td>{log.User ? log.User.username : `User ID ${log.user_id}`}</td>
                      <td className="text-muted small">{log.details}</td>
                    </tr>
                  ))}
                  {auditLogs.length === 0 && (
                    <tr><td colSpan="5" className="text-center p-4">No audit logs found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}