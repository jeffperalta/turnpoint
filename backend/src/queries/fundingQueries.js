const db = require('../database/db');

const baseFields = [
  'created_at',
  'updated_at',
  'id',
  'name',
  'fullName',
  'description'
];

async function getAllFundingsQuery() {
  const [rows] = await db.query(`
    SELECT ${baseFields.join(',  ')}
    FROM funding_sources;
  `);
  return rows;
}

async function checkEligibilityQuery(fundingId) {
  // TODO: Call External URL: fundings.sampleEligibilityURL
  const [rows] = await db.query(`
    SELECT name, fullName, description, fakeEligibilityResult 
    FROM funding_sources
    WHERE id=?;
  `, [fundingId]);
  return rows;
}

module.exports = {
  getAllFundingsQuery,
  checkEligibilityQuery,
};