const express = require('express');
const { getAllFundingsQuery, checkEligibilityQuery } = require('../queries/fundingQueries');
const router = express.Router();

router.get('/', async (req, res) => {
  try{
    res.json(await getAllFundingsQuery());

  }catch (err) {
    console.error("Error @ GET fundings: ", err);
    res.status(500).json({ error: err.message });
  }
});

router.post('/check-eligibility', async (req, res) => {
  try {
    const rows = await checkEligibilityQuery(req.body.fundingId);

    if (!rows.length) {
      return res.status(404).json({ error: 'Funding source not found' });
    }

    const { name, description, fullName, fakeEligibilityResult } = rows[0];
    const parsed = JSON.parse(fakeEligibilityResult);

    res.status(201).json({
      name,
      fullName,
      description,
      eligibilityResult: parsed.result,
      eligibilityMessage: parsed.message
    });
  } catch (err) {
    console.error("Error @ POST fundings.checkEligibility: ", err);
    res.status(500).json({ error: err.message });
  }
})

module.exports = router;