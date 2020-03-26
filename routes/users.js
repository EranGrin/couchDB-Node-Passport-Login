const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const passport = require("passport");

const User = require("../models/User");
const couchDb = require("../config/keys");
const dbName = new User();

const db = couchDb.use(dbName.dbName);
console.log("new style", db);
console.log(dbName.dbName);

// Load User model
const { forwardAuthenticated } = require("../config/auth");

// Login Page
router.get("/login", forwardAuthenticated, (req, res) => res.render("login"));

// Register Page
router.get("/register", forwardAuthenticated, (req, res) =>
  res.render("register")
);

// Register
router.post("/register", (req, res) => {
  const { name, email, password, password2 } = req.body;
  let errors = [];
  let newUser = {};

  if (!name || !email || !password || !password2) {
    errors.push({
      msg: "Please enter all fields"
    });
  }

  if (password != password2) {
    errors.push({
      msg: "Passwords do not match"
    });
  }

  if (password.length < 6) {
    errors.push({
      msg: "Password must be at least 6 characters"
    });
  }

  if (errors.length > 0) {
    res.render("register", {
      errors,
      name,
      email,
      password,
      password2
    });
  } else {
    db.find({
      selector: {
        email: {
          $eq: email
        }
      },
      fields: ["email"]
    })
      .then(doc => {
        console.log(doc);
        return doc.bookmark;
        debugger;
      })
      .then(erg => {
        console.log(erg);
        if (erg == "nil") {
          newUser = {
            name: name,
            email: email,
            password: password
          };
        } else {
          errors.push({
            msg: "Email already exists"
          });
          res.render("register", {
            errors,
            name,
            email,
            password,
            password2
          });
          return Promise.reject();
        }
      })
      .then(() => {
        bcrypt.hash(newUser.password, 10, function(err, hash) {
          // Store hash in your password DB.
          if (err) throw err;
          newUser.password = hash;
          db.insert(newUser);
          console.log(hash);
          console.log(newUser);
        });
      })
      .then(() => {
        req.flash("success_msg", "You are now registered and can log in");
      })
      .then(() => {
        res.redirect("/users/login");
        console.log("enter in db");
      })
      .catch(err => {
        console.log(err);
        res.send("Fehler");
      });
  }
});

// Login
router.post("/login", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/users/login",
    failureFlash: true
  })(req, res, next);
});

// Logout
router.get("/logout", (req, res) => {
  req.logout();
  req.flash("success_msg", "You are logged out");
  res.redirect("/users/login");
});

module.exports = router;
