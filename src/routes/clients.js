const express = require('express')
const router = express.Router();
const pool = require('../db');

router.get('/', async (req, res) => {
  res.status(200).send('OKAY')
})

router.get('/:id', async (req, res) => {
  const id = req.params.id;
  res.status(200).send('OKAY')
});

router.post('/', async (req, res) => {
  res.status(200).send('OKAY')
})

router.put('/:id', async (req, res) => {
  const id = req.params.id;
  res.status(200).send('OKAY')
});

router.delete('/:id', async (req, res) => {
  const id = req.params.id;
  res.status(200).send('OKAY')
});

module.exports = router;