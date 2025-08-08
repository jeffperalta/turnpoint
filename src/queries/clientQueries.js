const db = require('../database/db');

const baseFields = [
  'c.created_at',
  'c.updated_at',
  'c.identification',
  'c.id',
  'c.name',
  'DATE_FORMAT(c.date_of_birth, \'%Y-%m-%d\') AS date_of_birth',
  'c.main_language',
  'c.secondary_language',
  'f.id as funding_source_id',
  'f.name as funding_source_name'
];

async function getAllClientsQuery(query) {
  const [rows] = await db.query(`
    SELECT ${baseFields.join(',  ')}
    FROM clients as c
    LEFT JOIN funding_sources as f ON c.funding_source_id = f.id;
  `);
  return rows;
}

async function getClientByIdQuery(id) {
  const [rows] = await db.query(`
    SELECT ${baseFields.join(', ')}
    FROM clients as c
    LEFT JOIN funding_sources as f ON c.funding_source_id = f.id
    WHERE c.id=?`,
    [id]
  );
  return rows;
}

async function insertClientQuery(client) {
  const { 
    identification,
    name, 
    date_of_birth, 
    main_language, 
    secondary_language, 
    funding_source_id
  } = client;

  const now = new Date();
  const data = [now, identification, name, date_of_birth, main_language, secondary_language, funding_source_id];
  const placeholder = `${data.map(() => '?').join(', ')}`;

  const [result] = await db.execute(
      `INSERT INTO clients (
        created_at, 
        identification,
        name,
        date_of_birth,
        main_language,
        secondary_language,
        funding_source_id
      ) 
      VALUES (${placeholder});`,
      data
    );

    return result;
}

async function updateClientQuery(id, client) {
    const { 
      identification,
      name, 
      date_of_birth, 
      main_language, 
      secondary_language, 
      funding_source_id
    } = client;

    const now = new Date();
    const data = [now, identification, name, date_of_birth, main_language, secondary_language, funding_source_id, id];

    const [result] = await db.execute(
      `UPDATE clients 
       SET
        updated_at=?, 
        identification=?,
        name=?,
        date_of_birth=?,
        main_language=?,
        secondary_language=?,
        funding_source_id=?
      WHERE id=?;`,
      data
    );

    return result;
}

async function deleteClientQuery(id) {
  const [result] = await db.execute(
    'DELETE FROM clients '+
    'WHERE id=?',
    [id]
  );
  return result;
}

module.exports = {
  getAllClientsQuery,
  getClientByIdQuery,
  insertClientQuery,
  updateClientQuery,
  deleteClientQuery
};