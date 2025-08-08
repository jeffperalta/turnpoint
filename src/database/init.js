require('dotenv').config();
const db = require('./db');

const _createTable = (tableName, createStatement, fnxSeed) => {
  db.query(
    `SELECT COUNT(*) AS count 
    FROM information_schema.tables 
    WHERE table_schema = ? AND table_name = ?`,
    [process.env.DB_NAME, tableName],
    (err, results) => {
      if (err) throw err;
      const exists = results[0].count > 0;

      if (!exists) {
        db.query(createStatement,
          (err) => {
            _dbLog(tableName, err);
            if(fnxSeed) fnxSeed();
          }
        );
      } else {
        console.log(`${tableName}: Skipping creation and seed.`);
      }

    }
  );
}

const _dbLog = (tableName, err) => {
  if (err) throw err;
  console.log(`Created ${tableName} table.`);
}

function initDatabase() {
  // *** Create database table *** 

  // Table: funding_sources 
  _createTable(
    'funding_sources', 
    `CREATE TABLE funding_sources (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) UNIQUE
    )`, 
    () => {
      // Seed 
      const sources = ['NDIS', 'HCP', 'CHSP', 'DVA', 'HACC'];
      sources.forEach(source => {
        db.query(`INSERT INTO funding_sources (name) VALUES (?)`, [source]);
      });
    }
  );

  _createTable(
    'clients',
    `CREATE TABLE IF NOT EXISTS clients (
      created_at DATE NOT NULL,
      updated_at DATE NULL,
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      date_of_birth DATE NOT NULL,
      main_language VARCHAR(255),
      secondary_language VARCHAR(255),
      funding_source_id INT,
      FOREIGN KEY(funding_source_id) REFERENCES funding_sources(id)
    )`
  )

  // Table: users (authentication)
  // Table: languages lookup
}

module.exports = initDatabase;