const express = require("express");
const crypto = require("crypto");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const File = require("../models/File");
const { encrypt, decrypt } = require("../utils/crypto");
const bcrypt = require("bcrypt"); // FIXED spelling
const router = express.Router();

/* ================= MULTER SETUP ================= */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueName = crypto.randomUUID() + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

/* ================= UPLOAD API ================= */
/*
POST /api/files/upload
form-data:
- file
- expiresInHours
- password (optional)
*/
router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const expiresInHours = Number(req.body.expiresInHours);
    const passwordPlain = req.body.password; // optional

    if (!req.file || !expiresInHours || expiresInHours <= 0) {
      return res.status(400).json({ error: "Invalid input" });
    }

    // read file buffer and encrypt
    const fileBuffer = fs.readFileSync(req.file.path);
    const { encrypted, iv, tag } = encrypt(fileBuffer);
    fs.writeFileSync(req.file.path, encrypted);

    // generate download token
    const token = crypto.randomBytes(32).toString("hex");

    // hash password if provided
    let hashedPassword = null;
    if (passwordPlain) {
      const salt = await bcrypt.genSalt(10);
      hashedPassword = await bcrypt.hash(passwordPlain, salt);
    }

    // save metadata in DB
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

    res.json({
      message: "Encrypted file uploaded",
      downloadLink: `http://localhost:5000/api/files/download/${token}`
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ================= DOWNLOAD API ================= */
router.get("/download/:token", async (req, res) => {
  try {
    const { password } = req.query; // client sends ?password=1234
    const file = await File.findOne({ downloadToken: req.params.token });

    if (!file) return res.status(404).json({ message: "Invalid link" });
    if (file.expiresAt < Date.now()) return res.status(410).json({ message: "Link expired" });

    // check password if exists
    if (file.password) {
      if (!password) {
        return res.status(401).json({ message: "Password required" });
      }
      const match = await bcrypt.compare(password, file.password);
      if (!match) {
        return res.status(401).json({ message: "Incorrect password" });
      }
    }

    // read encrypted file
    const filePath = path.join(__dirname, "..", "uploads", file.storageKey);
    const encrypted = fs.readFileSync(filePath);

    // decrypt
    const decrypted = decrypt(encrypted, file.iv, file.tag);

    // send file to client
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${file.originalName}"`
    );
    res.send(decrypted);

    // one-time download: delete file + DB record
    fs.unlinkSync(filePath);
    await File.deleteOne({ _id: file._id });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
