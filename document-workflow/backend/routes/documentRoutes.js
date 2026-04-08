const express = require("express");
const router = express.Router();
const multer = require("multer");

// File upload config
const storage = multer.diskStorage({
  destination: function(req, file, cb) { cb(null, "uploads/"); },
  filename: function(req, file, cb) { cb(null, Date.now() + "-" + file.originalname); }
});
const upload = multer({ storage });

// Upload document (Employee)
router.post("/upload", upload.single("file"), (req, res) => {
  const employeeId = req.body.employee_id;
  const filename = req.file.filename;
  db.query(
    "INSERT INTO documents (employee_id, filename) VALUES (?,?)",
    [employeeId, filename],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Uploaded successfully" });
    }
  );
});

// Get employee documents
router.get("/employee/:id", (req,res)=>{
  const id = req.params.id;
  db.query("SELECT * FROM documents WHERE employee_id=?", [id], (err,result)=>{
    if(err) return res.status(500).json(err);
    res.json(result);
  });
});

// Manager: get all pending documents
router.get("/pending", (req,res)=>{
  db.query("SELECT d.id, d.filename, d.status, u.username FROM documents d JOIN users u ON d.employee_id=u.id WHERE d.status='Pending'", 
  (err,result)=>{
    if(err) return res.status(500).json(err);
    res.json(result);
  });
});

// Manager approve/reject
router.put("/review/:id", (req,res)=>{
  const { status } = req.body; // Approved or Rejected
  const id = req.params.id;
  db.query("UPDATE documents SET status=? WHERE id=?", [status, id], (err)=>{
    if(err) return res.status(500).json(err);
    res.json({message:"Status updated"});
  });
});

module.exports = router;