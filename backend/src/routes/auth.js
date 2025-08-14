const express = require('express')
const router = express.Router();
const { 
  validateRegistration 
} = require('../validators/authValidators');
const { 
  getUserByEmail, 
  registerAccount
} = require('../queries/authQueries');
const { 
  issueSession, 
  compareHash,
  requireAuth, 
  destroySession 
} = require('../session');

router.post('/register', async(req, res) => {
  try{
    const validation = validateRegistration(req.body);
    if(validation.hasError) {
      return res.status(validation.status)
        .send(validation.message);
    }

    const { email, password } = req.body || {};

    const found = await getUserByEmail(email);
    if(found.length) {
      return res.status(409).json({ error: 'Email already in use' });
    }

    const result = registerAccount(email, password);
    const user = { id: result.insertId, email };
    const sessionToken = issueSession(user);
    res.status(201).json({ user, sessionToken });

  }catch(err) {
    console.error("Error @ Auth Register: ", err);
    res.status(500).json({ error: err.message });
  }
});

router.post('/login', async(req, res) => {
  try{
    const validation = validateRegistration(req.body);
    if(validation.hasError) {
      return res.status(validation.status)
        .send(validation.message);
    }

    const { email, password } = req.body || {};

    const found = await getUserByEmail(email);
    if (!found.length) {
      return res.status(401)
        .json({ message: 'Invalid credentials' });
    }

    const foundUser = found[0];

    const ok = await compareHash(password, foundUser.password);
    if(!ok) {
      return res.status(401)
        .json({ message: 'Invalid credentials' });
    }

    const user = { id: foundUser.id, email };
    const sessionToken = issueSession(user);
    res.json({ user, sessionToken });

  }catch(err) {
    console.error("Error @ Auth Login: ", err);
    res.status(500).json({ error: err.message });
  }
  
});

router.post('/logout', requireAuth, async(req, res) => {
  destroySession(req.sessionToken);
  res.json({ ok: true });
});


module.exports = router;