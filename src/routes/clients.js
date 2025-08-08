const express = require('express')
const router = express.Router();
const db = require('../database/db');
const Joi = require('joi');

const _validationSchema = (client) => {
  const schema = Joi.object({
    identification: Joi.string(),
    name: Joi.string().min(3).required(),
    date_of_birth: Joi.date()
      .less('now')  // must be in the past
      .required()   
      .label('Date of Birth'),
    main_language: Joi.string()
      .required()
      .label('Main Language'),
    secondary_language: Joi.string()
      .empty('')
      .allow(null)
      .label('Secondary Language'), 
    funding_source_id: Joi.number()
      .allow(null)
      .label('Funding Source')
  });

  return schema.validate(client);
}

const _validate = (client) => {
  const validation = _validationSchema(client);
  const result = {
    hasError: false,
    status: 200,
    message: ""
  };

  if(validation.error) {
    result.hasError = true;
    result.status = 400;
    result.message = validation.error.details[0].message;
  }

  return result;
}


router.get('/', async (req, res) => {
  try{
    const query = req.query; //TODO: Sorting, Pagination, Filter: funding_source

    const fields = [
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

    const [rows] = await db.query(`
      SELECT ${fields.join(',  ')}
      FROM clients as c
      LEFT JOIN funding_sources as f ON c.funding_source_id = f.id
    `);

    res.json(rows);
  }catch (err) {
    console.error("Error @ GET Clients: ", err);
    res.status(500).json({ error: err.message });
  }
})

router.get('/:id', async (req, res) => {
  const id = req.params.id;
  try{
    const fields = [
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

    const [rows] = await db.query(`
      SELECT ${fields.join(',  ')}
      FROM clients as c
      LEFT JOIN funding_sources as f ON c.funding_source_id = f.id
      WHERE c.id=?
    `, [id]);

    if(rows.length > 0) res.json(...rows);
    else res.status(404).json({ error: 'Not found' });

  }catch (err) {
    console.error("Error @ GET Client: ", err);
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  const validation = _validate(req.body);
  if(validation.hasError) {
    return res.status(validation.status)
      .send(validation.message);
  }

  const { 
    identification,
    name, 
    date_of_birth, 
    main_language, 
    secondary_language, 
    funding_source_id
  } = req.body;

  try {
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

    res.status(201).json({
      message: 'Client created successfully',
      clientId: result.insertId
    });
  } catch (err) {
    console.error("Error @ POST Client: ", err);
    res.status(500).json({ error: err.message });
  }
})

router.put('/:id', async (req, res) => {
  const validation = _validate(req.body);
  if(validation.hasError) {
    return res.status(validation.status)
      .send(validation.message);
  }

  const id = req.params.id;
  const { 
    identification,
    name, 
    date_of_birth, 
    main_language, 
    secondary_language, 
    funding_source_id
  } = req.body;

  try {
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

    if(result.affectedRows) {
      res.status(200).json({
        message: 'Client updated successfully',
        clientId: id
      });
    }else{
      res.status(404).json({
        message: 'Nothing was updated'
      });
    }
    
  } catch (err) {
    console.error("Error @ PUT Client: ", err);
    res.status(500).json({ error: err.message });
  }

});

router.delete('/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const [result] = await db.execute(
      'DELETE FROM clients '+
      'WHERE id=?',
      [id]
    );

    if(result.affectedRows) {
      res.status(200).json({
        message: 'Client deleted successfully',
        clientId: id
      });
    }else{
      res.status(404).json({
        message: 'Nothing was deleted'
      });
    }

  } catch (err) {
    console.error("Error @ DELETE Client: ", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;