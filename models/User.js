'use strict';
const couchDb = require('../config/keys');
const cheeckName = require('../config/db');
let dbName = 'users'

console.log('name', cheeckName);

class User {
  constructor({
    name= "",
    email= "",
    password= ""
  } = {}) {
      this.name = name,
      this.email = email,
      this.password = password
  }

  get dbName() {
      return dbName;

  }




}
module.exports = User;
