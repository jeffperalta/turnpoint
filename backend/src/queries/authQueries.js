const db = require('../database/db');
const { createHash } = require('../session');


async function getUserByEmail(email) {
  const [result] = await db.query(
    `SELECT id, password FROM users WHERE email=?`,
    [email]
  )
  return result;
}

async function getUserByEmailAndPassword(email, password) {
  const hash = await createHash(password);
  const [result] = await db.query(
    `SELECT id FROM users WHERE email=? AND password=?`,
    [email, hash]
  )
  return result;
}

async function registerAccount(email, password) {
  const hash = await createHash(password);

  const now = new Date();
  const [result] = await db.query(
    `INSERT INTO users (created_at, email, password)
     VALUES (?,?,?);`,
    [now, email, hash]
  );

  return result;
}

module.exports = {
  getUserByEmail,
  registerAccount,
  //getUserByEmailAndPassword
}