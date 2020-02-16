const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');

// Load DB (need to find how to declare the db globaly)
let db = '';
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
        console.log( 'DB is Loaded' );
         db = datenbank.use(dbName)
       
    })


// Load User model
module.exports = function(passport) {
  passport.use(
    new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
      // Match user

      db.find ({
        selector: { email :  email},
        fields: [ "email", 'password', '_id']
        })
      .then( 
        //// here should come a check for the user/email
        
        user => {
        console.log('this is the user from pasport',user)
        console.log(user.docs[0].password)
        if (!user) {
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
    console.log(user)
    console.log(user.docs[0]._id)

    done(null, user); // :-)

  });
})
}


// User.findOne({
//   email: email
// }).then(user => {
//   if (!user) {
//     return done(null, false, { message: 'That email is not registered' });
//   }
