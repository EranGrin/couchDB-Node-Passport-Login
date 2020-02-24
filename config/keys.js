'use strict';

const nano = require('nano')('http://admin:admin@localhost:5984');
module.exports = nano.db;
