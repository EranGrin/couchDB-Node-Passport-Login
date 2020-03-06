const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');

const User = require('../models/User');
const couchDb = require('../config/keys');
const dbName = new User

const db = couchDb.use(dbName.dbName);


// Load User model
module.exports = function(passport) {
  passport.use(
    new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
      // Match user

      db.find ({
        selector: { email :  email},
        fields: [ "email", 'password', '_id']
        })
         

      .then(user => {
        // console.log(user)
        // console.log(user.docs[0].password)
        if (user.bookmark == 'nil') {
          return done(null, false, { message: 'That email is not registered' });
        }

        // Match password
        bcrypt.compare(password, user.docs[0].password, (err, isMatch) => {
          if (err) throw err;
          if (isMatch) {
            return done(null, user);
          } else {
            return done(null, false, { message: 'Password incorrect' });
          }
        });
      });
    })
  );

   
 passport.serializeUser(function(user, done) {
  done(null, user.docs[0]._id);
});


passport.deserializeUser(function(id, done) {
  db.find ({
    selector: { _id :  id},
    fields: [ "email", 'password', '_id', 'name']
    }) 
  .then(user => {
    // console.log(user)
    // console.log(user.docs[0]._id)

    done(null, user); // :-)

  });
})
}