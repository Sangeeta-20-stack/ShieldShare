const multer = require("multer");
const path = require("path");
const crypto = require("crypto");

const MAX_FILE_SIZE = 1024 * 1024 * 1024; // 1 GB

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },

  filename: (req, file, cb) => {
    const uniqueName =
      crypto.randomUUID() + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});

const fileFilter = (req, file, cb) => {
  // block dangerous types
  const blocked = [".exe", ".sh", ".bat", ".cmd", ".msi"];
  const ext = path.extname(file.originalname).toLowerCase();

  if (blocked.includes(ext)) {
    return cb(new Error("File type not allowed"), false);
  }

  cb(null, true);
};

const upload = multer({
  storage,
  limits: {
    fileSize: MAX_FILE_SIZE
  },
  fileFilter
});

module.exports = upload;
