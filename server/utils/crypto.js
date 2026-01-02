const crypto = require("crypto");

const ALGO = "aes-256-gcm";
const KEY = crypto
  .createHash("sha256")
  .update(process.env.FILE_SECRET)
  .digest(); // 32 bytes

function encrypt(buffer) {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(ALGO, KEY, iv);

  const encrypted = Buffer.concat([
    cipher.update(buffer),
    cipher.final()
  ]);

  const tag = cipher.getAuthTag();

  return {
    encrypted,
    iv: iv.toString("hex"),
    tag: tag.toString("hex")
  };
}

function decrypt(encrypted, iv, tag) {
  const decipher = crypto.createDecipheriv(
    ALGO,
    KEY,
    Buffer.from(iv, "hex")
  );

  decipher.setAuthTag(Buffer.from(tag, "hex"));

  return Buffer.concat([
    decipher.update(encrypted),
    decipher.final()
  ]);
}

module.exports = { encrypt, decrypt };
