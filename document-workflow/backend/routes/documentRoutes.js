const express = require("express");
const router = express.Router();
const multer = require("multer");
const { User, Document, AuditLog, Notification, WorkflowStage } = require("../models");

// File upload config
const storage = multer.diskStorage({
  destination: function(req, file, cb) { cb(null, "uploads/"); },
  filename: function(req, file, cb) { cb(null, Date.now() + "-" + file.originalname); }
});
const upload = multer({ storage });

// Admin: Get ALL documents (For Admin Dashboard)
router.get("/", async (req, res) => {
  try {
    const docs = await Document.findAll({
      include: [
        { model: User, attributes: ['username', 'email'] },
        { model: AuditLog, include: [{ model: User, attributes: ['username'] }] }
      ]
    });
    res.json(docs);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

// Employee: Upload document
router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const employeeId = req.body.employee_id;
    const title = req.body.title || "Untitled Document"; // We will add title field in frontend soon
    const filename = req.file.filename;

    const doc = await Document.create({
      title,
      filename,
      employee_id: employeeId,
      status: "Pending" // Defaults to pending
    });

    // Create Audit Log
    await AuditLog.create({
      document_id: doc.id,
      user_id: employeeId,
      action: "Uploaded",
      details: "Document initially uploaded by Employee."
    });

    // Notify Managers (Find a Manager to notify - simplified logic)
    const managers = await User.findAll({ where: { role: 'manager' } });
    for (const manager of managers) {
      await Notification.create({
        user_id: manager.id,
        message: `New document "${title}" uploaded by employee pending review.`
      });
    }

    res.json({ message: "Uploaded successfully", document: doc });
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

// Employee: Get my documents
router.get("/employee/:id", async (req, res) => {
  try {
    const docs = await Document.findAll({
      where: { employee_id: req.params.id },
      include: [{ model: AuditLog }] // Include audit history
    });
    res.json(docs);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

// Manager: Get all pending documents
router.get("/pending", async (req, res) => {
  try {
    const pendingDocs = await Document.findAll({
      where: { status: "Pending" },
      include: [{ model: User, attributes: ['username'] }]
    });

    // Format for legacy frontend compatibility (doc.username instead of doc.User.username)
    const formatted = pendingDocs.map(doc => ({
      id: doc.id,
      filename: doc.filename,
      status: doc.status,
      username: doc.User ? doc.User.username : 'Unknown'
    }));
    
    res.json(formatted);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

// Manager: Approve/Reject document
router.put("/review/:id", async (req, res) => {
  try {
    const { status, manager_id } = req.body; // Approved or Rejected
    const docId = req.params.id;

    const doc = await Document.findByPk(docId);
    if (!doc) return res.status(404).json({ message: "Document not found" });

    doc.status = status;
    await doc.save();

    // Create Audit Trail
    await AuditLog.create({
      document_id: doc.id,
      user_id: manager_id || 1, // Fallback if frontend isn't sending manager_id yet
      action: status,
      details: `Document reviewed by Manager.`
    });

    // Notify Employee
    await Notification.create({
      user_id: doc.employee_id,
      message: `Your document "${doc.title}" has been ${status}.`
    });

    res.json({ message: `Document status updated to ${status}` });
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

// Shared: Get Notifications for user
router.get("/notifications/:userId", async (req, res) => {
  try {
    const notifications = await Notification.findAll({
      where: { user_id: req.params.userId },
      order: [['createdAt', 'DESC']]
    });
    res.json(notifications);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

module.exports = router;