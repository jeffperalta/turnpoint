const mysql = require('mysql2');
const createTable = require('./util');

require('dotenv').config();
const db = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

function initDatabase() {
  // *** Create database table *** 

  // Table: funding_sources 
  createTable(db,
    'funding_sources', 
    `CREATE TABLE funding_sources (
      created_at DATE NOT NULL,
      updated_at DATE NULL,
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(10) UNIQUE,
      fullName VARCHAR(255) NULL,
      description TEXT NULL,
      eligibilityURL VARCHAR(255) NULL,
      fakeEligibilityResult TEXT NULL
    )`, 
    () => {
      // Seed 
      const newDate = new Date();
      const sources = [
        {
          name: 'NDIS',
          fullName: 'National Disability Insurance Scheme',
          description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce pulvinar non dui quis auctor. Aliquam imperdiet, elit ut faucibus bibendum, sem justo accumsan odio, sit amet fermentum arcu mi id nibh.',
          sampleEligibilityURL: 'https://www.ndis.com',
          fakeEligibilityResult: '{"result": "valid", "message": "Meets age requirement and residency criteria."}'
        },
        {
          name: 'HCP',
          fullName: 'Home Care Package',
          description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce pulvinar non dui quis auctor. Aliquam imperdiet, elit ut faucibus bibendum, sem justo accumsan odio, sit amet fermentum arcu mi id nibh.',
          sampleEligibilityURL: 'https://www.hcp.com',
          fakeEligibilityResult: '{"result": "valid", "message": "Meets age requirement and residency criteria."}'
        },
        {
          name: 'CHSP',
          fullName: 'Commonwealth Home Support Programme',
          description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce pulvinar non dui quis auctor. Aliquam imperdiet, elit ut faucibus bibendum, sem justo accumsan odio, sit amet fermentum arcu mi id nibh.',
          sampleEligibilityURL: 'https://www.chsp.com',
          fakeEligibilityResult: '{"result": "valid", "message": "Meets age requirement and residency criteria."}'
        },
        {
          name: 'DVA',
          fullName: 'Department of Veteran\'s Affairs',
          description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce pulvinar non dui quis auctor. Aliquam imperdiet, elit ut faucibus bibendum, sem justo accumsan odio, sit amet fermentum arcu mi id nibh.',
          sampleEligibilityURL: 'https://www.dva.com',
          fakeEligibilityResult: '{"result": "valid", "message": "Meets age requirement and residency criteria."}'
        },
        {
          name: 'HACC',
          fullName: 'Home and Community Care Program',
          description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce pulvinar non dui quis auctor. Aliquam imperdiet, elit ut faucibus bibendum, sem justo accumsan odio, sit amet fermentum arcu mi id nibh.',
          sampleEligibilityURL: 'https://www.hacc.com',
          fakeEligibilityResult: '{"result": "invalid", "message": "Missing income documentation."}'
        }
      ];
      sources.forEach(source => {
        db.query(`
          INSERT INTO funding_sources (created_at, name, fullName, description, eligibilityURL, fakeEligibilityResult) 
          VALUES (?, ?, ?, ?, ?, ?)
        `, [
          newDate, source.name, source.fullName, source.description,
          source.sampleEligibilityURL, source.fakeEligibilityResult
        ]);
      });
    }
  );

  createTable(db,
    'clients',
    `CREATE TABLE IF NOT EXISTS clients (
      created_at DATE NOT NULL,
      updated_at DATE NULL,
      id INT AUTO_INCREMENT PRIMARY KEY,
      identification VARCHAR(255) UNIQUE,
      name VARCHAR(255) NOT NULL,
      date_of_birth DATE NOT NULL,
      main_language VARCHAR(2),
      secondary_language VARCHAR(2),
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
        'main_language': 'en',
        'secondary_language': 'es',
        'funding_source_id': 1
      },{
        'created_at': newDate,
        'updated_at': newDate,
        'identification': 'P1234-2323-1',
        'name': 'Jane Doe',
        'date_of_birth': new Date('1990-12-31').toISOString().split('T')[0],
        'main_language': 'tl',
        'secondary_language': 'zh',
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