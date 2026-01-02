const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const FileSchema = new mongoose.Schema({
  fileId: { type: String, required: true },
  storageKey: { type: String, required: true },
  originalName: { type: String, required: true },
  size: { type: Number, required: true },
  iv: { type: String, required: true },
  tag: { type: String, required: true },
  downloadToken: { type: String, required: true, unique: true },
  expiresAt: { type: Date, required: true },
  password: String, // optional hashed password
  createdAt: { type: Date, default: Date.now }
});

FileSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model("File", FileSchema);
