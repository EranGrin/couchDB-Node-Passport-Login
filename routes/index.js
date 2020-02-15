const express = require('express');
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');

// Load DB (need to find how to declare the db globaly)
let db = '' ;
const nano = require ( 'nano' )('http://admin:admin@localhost:5984');
let datenbank = nano.db;
let dbName = 'users';

datenbank.list().then(
    erg => {
        if ( !erg.includes(dbName) ) return datenbank.create(dbName);
        else return true;
    }
).then(
    () => datenbank.use(dbName)
).then(
    () => {
        
         db = datenbank.use(dbName)
        // console.log(db)
    })

    
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
