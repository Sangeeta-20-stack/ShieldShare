const express = require("express");
const crypto = require("crypto");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const File = require("../models/File");
const { encrypt, decrypt } = require("../utils/crypto");
const bcrypt = require("bcrypt");
const router = express.Router();

// Make sure uploads folder exists
const UPLOAD_DIR = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

/* ================= MULTER SETUP ================= */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    const uniqueName = crypto.randomUUID() + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});
const upload = multer({ storage });

/* ================= UPLOAD API ================= */
router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const expiresInHours = Number(req.body.expiresInHours);
    const passwordPlain = req.body.password;

    if (!req.file || !expiresInHours || expiresInHours <= 0) {
      return res.status(400).json({ error: "Invalid input" });
    }

    const fileBuffer = fs.readFileSync(req.file.path);
    const { encrypted, iv, tag } = encrypt(fileBuffer);
    fs.writeFileSync(req.file.path, encrypted);

    const token = crypto.randomBytes(32).toString("hex");

    let hashedPassword = null;
    if (passwordPlain) {
      const salt = await bcrypt.genSalt(10);
      hashedPassword = await bcrypt.hash(passwordPlain, salt);
    }

    await File.create({
      fileId: crypto.randomUUID(),
      originalName: req.file.originalname,
      size: req.file.size,
      storageKey: req.file.filename,
      iv,
      tag,
      downloadToken: token,
      password: hashedPassword,
      expiresAt: new Date(Date.now() + expiresInHours * 3600000)
    });

    // Use deployed backend URL here
    const BACKEND_URL = "https://shieldshare-backend.onrender.com";
    res.json({
      message: "Encrypted file uploaded",
      downloadLink: `${BACKEND_URL}/api/files/download/${token}`
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ================= DOWNLOAD API ================= */
router.get("/download/:token", async (req, res) => {
  try {
    const { password } = req.query;
    const file = await File.findOne({ downloadToken: req.params.token });

    if (!file) return res.status(404).json({ message: "Invalid link" });
    if (file.expiresAt < Date.now()) return res.status(410).json({ message: "Link expired" });

    if (file.password) {
      if (!password) return res.status(401).json({ message: "Password required" });
      const match = await bcrypt.compare(password, file.password);
      if (!match) return res.status(401).json({ message: "Incorrect password" });
    }

    const filePath = path.join(UPLOAD_DIR, file.storageKey);
    if (!fs.existsSync(filePath)) return res.status(404).json({ message: "File missing" });

    const encrypted = fs.readFileSync(filePath);
    const decrypted = decrypt(encrypted, file.iv, file.tag);

    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${file.originalName}"`
    );
    res.send(decrypted);

    // one-time download
    fs.unlinkSync(filePath);
    await File.deleteOne({ _id: file._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

