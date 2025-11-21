// middlewares/verifySetuSignature.js
const crypto = require("crypto");

/**
 * Helper: verify raw buffer with signature header using webhook secret.
 * rawBuffer: Buffer or string
 * signatureHeader: string (hex)
 */
function verifySignature(rawBuffer, signatureHeader) {
  const secret = process.env.SETU_WEBHOOK_SECRET;
  if (!secret || !signatureHeader) return false;
  // Ensure we operate on Buffer/string consistently
  const raw = Buffer.isBuffer(rawBuffer) ? rawBuffer : Buffer.from(String(rawBuffer));
  const expected = crypto.createHmac("sha256", secret).update(raw).digest("hex");
  // timing-safe compare
  try {
    const sigBuf = Buffer.from(String(signatureHeader));
    const expBuf = Buffer.from(expected);
    if (sigBuf.length !== expBuf.length) return false;
    return crypto.timingSafeEqual(sigBuf, expBuf);
  } catch (e) {
    return false;
  }
}

// Middleware: expects express.raw({type:'*/*'}) before it so req.body is a Buffer.

function verifySetuSignatureMiddleware(req, res, next) {
  const signatureHeader =
    req.headers["x-setu-signature"] || req.headers["x-signature"] || "";
  const rawBuffer = req.body; // express.raw sets req.body to Buffer
  if (!verifySignature(rawBuffer, signatureHeader)) {
    return res.status(401).send("Invalid Setu signature");
  }
  // attach verified flag (optional) and raw text for downstream
  req.setuVerified = true;
  req.setuRawBody = rawBuffer; // Buffer
  next();
}

module.exports = {
  verifySignature,
  verifySetuSignatureMiddleware,
};
