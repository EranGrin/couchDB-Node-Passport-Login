const express = require('express');
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');

const User = require('../models/User');
const couchDb = require('../config/keys');
const dbName = new User
const db = couchDb.use(dbName.dbName);


// Welcome Page
router.get('/', forwardAuthenticated, (req, res) => res.render('welcome'));

// Dashboard
router.get('/dashboard', ensureAuthenticated, (req, res) =>
  res.render('dashboard', {
    user: req.user

  })
);

// Am-I-Here
router.post('/dashboard', (req, res) => {
  console.log(req.body);
  db.insert(
      {
        binding_id: req.body.binding_id,
        statment: req.body.statment,
        timestamp: req.body.timestamp
          // binding_id: req.body.bundesland,
      }
  ).then(
      () => res.send(req.body)
  ).catch(
      err => {
          console.log(err);
          res.send('Fehler');
      }
  )


})


module.exports = router;
