const express = require('express')
const router = express.Router();
const { 
  getAllClientsQuery,
  getClientByIdQuery,
  insertClientQuery,
  updateClientQuery,
  deleteClientQuery
} = require('../queries/clientQueries');
const { validateClient } = require('../validators/clientValidator');


router.get('/', async (req, res) => {
  try{
    const query = req.query; //TODO: Sorting, Pagination, Filter: funding_source
    res.json(await getAllClientsQuery(query));

  }catch (err) {
    console.error("Error @ GET Clients: ", err);
    res.status(500).json({ error: err.message });
  }
})

router.get('/:id', async (req, res) => {
  const id = req.params.id;
  
  try{
    const rows = await getClientByIdQuery(id);
    if(rows.length > 0) res.json(...rows);
    else res.status(404).json({ error: 'Not found' });
  }catch (err) {
    console.error("Error @ GET Client: ", err);
    res.status(500).json({ error: err.message });
  }

});

router.post('/', async (req, res) => {
  const validation = validateClient(req.body);
  if(validation.hasError) {
    return res.status(validation.status)
      .send(validation.message);
  }

  try {
    const result = await insertClientQuery(req.body);
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
  const validation = validateClient(req.body);
  if(validation.hasError) {
    return res.status(validation.status)
      .send(validation.message);
  }

  const id = req.params.id;

  try {
    const result = await updateClientQuery(id, req.body);

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
    const result = await deleteClientQuery(id);

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