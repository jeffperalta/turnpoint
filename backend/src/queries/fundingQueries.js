const db = require('../database/db');

const baseFields = [
  'created_at',
  'updated_at',
  'id',
  'name'
];

async function getAllFundingsQuery() {
  const [rows] = await db.query(`
    SELECT ${baseFields.join(',  ')}
    FROM funding_sources;
  `);
  return rows;
}

module.exports = {
  getAllFundingsQuery,
};