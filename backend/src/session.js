const crypto = require('crypto');
const bcrypt = require('bcrypt');

const sessions = new Map();
const TOKEN_TTL_MS = parseInt(process.env.TOKEN_TTL_MS || '86400000', 10);

function makeToken() {
  return crypto.randomBytes(32).toString('hex'); 
}

async function createHash(password) {
  return await bcrypt.hash(password, 10);
}

async function compareHash(text, hash) {
  return await bcrypt.compare(text, hash);
}

function issueSession(user) {
  const token = makeToken();
  sessions.set(token, {
    userId: user.id,
    email: user.email,
    expiresAt: Date.now() + TOKEN_TTL_MS
  });
  return token;
}

function destroySession(token) {
  sessions.delete(token);
}

function requireAuth(req, res, next) {
  const token = req.header('x-session-token'); // frontend sends this
  if (!token) return res.status(401).json({ message: 'Missing session token' });

  const sess = sessions.get(token);
  if (!sess) return res.status(401).json({ message: 'Invalid session' });

  if (sess.expiresAt < Date.now()) {
    sessions.delete(token);
    return res.status(401).json({ message: 'Session expired' });
  }

  // attach user to request
  req.sessionToken = token;
  req.user = { id: sess.userId, email: sess.email };
  next();
}

module.exports = {
  issueSession,
  destroySession,
  requireAuth,
  createHash,
  compareHash
};