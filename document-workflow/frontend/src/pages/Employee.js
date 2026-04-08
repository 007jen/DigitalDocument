import React, { useState, useEffect } from "react";
import axios from "axios";

export default function Employee() {
  const [docs, setDocs] = useState([]);
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const userId = localStorage.getItem("userId") || 3; // employee id

  const fetchDocs = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/documents/employee/${userId}`);
      setDocs(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchDocs();
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file || !title) return alert("Please provide a title and select a file!");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);
    formData.append("employee_id", userId);

    try {
      await axios.post("http://localhost:5000/api/documents/upload", formData);
      setFile(null);
      setTitle("");
      fetchDocs();
      alert("Document uploaded successfully!");
    } catch (err) {
      console.error(err);
      alert("Upload failed.");
    }
  };

  return (
    <div className="container-fluid">
      <h2>My Documents 📄</h2>
      
      <div className="row g-4 mt-2">
        {/* Upload Section */}
        <div className="col-lg-4">
          <div className="glass-panel floating-card">
            <h5 className="mb-4 fw-bold text-primary">Upload New Document</h5>
            <form onSubmit={handleUpload}>
              <div className="mb-3">
                <label className="form-label text-muted small fw-bold">DOCUMENT TITLE</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="e.g., Q3 Expense Report" 
                  value={title} 
                  onChange={(e)=>setTitle(e.target.value)} 
                />
              </div>
              
              <div className="mb-4">
                <label className="form-label text-muted small fw-bold">SELECT FILE</label>
                <div className="border border-2 border-dashed rounded p-4 text-center bg-light" style={{ cursor: "pointer", borderColor: "#cbd5e1", borderStyle: "dashed" }}>
                   <input 
                    type="file" 
                    className="form-control shadow-none" 
                    onChange={(e)=>setFile(e.target.files[0])}
                    style={{ opacity: 1 }}
                   />
                </div>
              </div>

              <button type="submit" className="btn btn-primary w-100 fw-bold shadow-sm py-2">
                Submit for Approval
              </button>
            </form>
          </div>
        </div>

        {/* Tracking Section */}
        <div className="col-lg-8">
          <div className="glass-panel h-100 floating-card" style={{ animationDelay: "1s" }}>
            <h5 className="mb-4 fw-bold">Document Tracking</h5>
            
            {docs.length === 0 ? (
              <div className="text-center text-muted p-5">
                <p>You haven't uploaded any documents yet.</p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>File Name</th>
                      <th>Current Status</th>
                      <th>Notes / Reason</th>
                      <th>Submitted On</th>
                    </tr>
                  </thead>
                  <tbody>
                    {docs.map(doc => (
                      <tr key={doc.id}>
                        <td className="fw-bold">{doc.title}</td>
                        <td className="text-muted">{doc.filename.substring(14)}</td>
                        <td>
                          <span className={`badge rounded-pill bg-${doc.status === 'Approved' ? 'success' : doc.status === 'Rejected' ? 'danger' : 'warning text-dark'} px-3 py-2`}>
                            {doc.status}
                          </span>
                        </td>
                        <td>
                          {doc.status === 'Rejected' && doc.rejection_reason ? (
                            <span className="text-danger small fw-bold">"{doc.rejection_reason}"</span>
                          ) : (
                            <span className="text-muted small">-</span>
                          )}
                        </td>
                        <td className="text-muted small">
                          {new Date(doc.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
