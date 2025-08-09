const createTable = (db, tableName, createStatement, fnxSeed) => {
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

module.exports = createTable;