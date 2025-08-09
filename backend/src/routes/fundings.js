const express = require('express');
const { getAllFundingsQuery } = require('../queries/fundingQueries');
const router = express.Router();

router.get('/', async (req, res) => {
  try{
    res.json(await getAllFundingsQuery());

  }catch (err) {
    console.error("Error @ GET fundings: ", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;