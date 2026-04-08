import React, { useState, useEffect } from "react";
import axios from "axios";

export default function Admin() {
  const [docs, setDocs] = useState([]);
  const [activeTab, setActiveTab] = useState("documents");
  const [loading, setLoading] = useState(false);

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
  }, []);

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
      <p className="text-muted mb-4">Complete oversight of the Digital Workflow Automation System.</p>

      {/* Tabs */}
      <ul className="nav nav-pills mb-4" style={{ gap: '0.5rem' }}>
        <li className="nav-item">
          <button
            className={`nav-link fw-bold ${activeTab === 'documents' ? 'active shadow-sm' : 'text-muted'}`}
            onClick={() => setActiveTab('documents')}
            style={activeTab === 'documents' ? {} : {}}
          >
            All Documents
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link fw-bold ${activeTab === 'audit' ? 'active shadow-sm' : 'text-muted'}`}
            onClick={() => setActiveTab('audit')}
            style={activeTab === 'audit' ? { backgroundColor: 'var(--primary)' } : {}}
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
            <h5 className="mb-4 fw-bold">All Processed Documents</h5>
            <div className="table-responsive">
              <table className="table table-hover align-middle bg-white rounded shadow-sm overflow-hidden">
                <thead className="bg-light">
                  <tr>
                    <th>ID</th>
                    <th>Document Title</th>
                    <th>Owner (Employee)</th>
                    <th>Current Status</th>
                    <th>Last Updated</th>
                  </tr>
                </thead>
                <tbody>
                  {docs.map(doc => (
                    <tr key={doc.id}>
                      <td className="text-muted fw-bold">#{doc.id}</td>
                      <td className="fw-bold">{doc.title}</td>
                      <td>{doc.User ? doc.User.username : 'Unknown'}</td>
                      <td>
                        <span className={`badge rounded-pill bg-${doc.status === 'Approved' ? 'success' : doc.status === 'Rejected' ? 'danger' : 'warning text-dark'} px-3 py-2`}>
                          {doc.status}
                        </span>
                      </td>
                      <td className="text-muted small">
                        {new Date(doc.updatedAt).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                  {docs.length === 0 && (
                    <tr><td colSpan="5" className="text-center p-4">No documents found.</td></tr>
                  )}
                </tbody>
              </table>
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
                    <th>Action Executed</th>
                    <th>Document</th>
                    <th>Executed By</th>
                    <th>Details</th>
                  </tr>
                </thead>
                <tbody>
                  {auditLogs.map(log => (
                    <tr key={log.id}>
                      <td className="text-muted small">
                        {new Date(log.createdAt).toLocaleString()}
                      </td>
                      <td>
                        <span className={`badge bg-${log.action === 'Approved' ? 'success' : log.action === 'Rejected' ? 'danger' : 'primary'} px-3 py-1`}>
                          {log.action}
                        </span>
                      </td>
                      <td className="fw-bold">{log.docTitle} (ID:{log.docId})</td>
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