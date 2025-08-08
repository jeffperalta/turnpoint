const mysql = require('mysql2');

require('dotenv').config();
const db = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

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
      identification VARCHAR(255) UNIQUE,
      name VARCHAR(255) NOT NULL,
      date_of_birth DATE NOT NULL,
      main_language VARCHAR(255),
      secondary_language VARCHAR(255),
      funding_source_id INT NULL,
      FOREIGN KEY(funding_source_id) REFERENCES funding_sources(id)
    )`,
    () => {
      // Seed 
      const newDate = new Date();
      const sources = [{
        'created_at': newDate,
        'updated_at': newDate,
        'identification': 'G1231234Q',
        'name': 'John Doe',
        'date_of_birth': new Date('1980-01-01').toISOString().split('T')[0],
        'main_language': 'English',
        'secondary_language': 'Spanish',
        'funding_source_id': 1
      },{
        'created_at': newDate,
        'updated_at': newDate,
        'identification': 'P1234-2323-1',
        'name': 'Jane Doe',
        'date_of_birth': new Date('1990-12-31').toISOString().split('T')[0],
        'main_language': 'Filipino',
        'secondary_language': 'Mandarin',
        'funding_source_id': null
      }];

      sources.forEach(source => {
        const keys = Object.keys(source);
        const values = Object.values(source);
        const placeholders = keys.map(() => '?').join(', ');

        db.query(`
          INSERT INTO clients (${keys.join(', ')}) 
          VALUES (${placeholders})
        `,values
        );
      });
    }
  )

  // Table: users (authentication)
  // Table: languages lookup
}

module.exports = initDatabase;