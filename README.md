
# CouchDB-Node-Passport-Login

This is a user login and registration app using Node.js, Express, Passport, CouchDB, EJS and some other packages.

### Version: 0.3.0

### Usage
Install:

1. You will have to install couchDB locally (dbPort: 5984)
1. Credential for CouchDB should be user:admin pass:admin (
2. Create db name: useres
(Obviously Credential and dbName dbPort etc.. Can be change in the code) 

```sh
$ npm install
```

```sh
$ npm start
# Or run with Nodemon
$ npm run dev

# Visit http://localhost:4000
```

### CouchDB
db name value is in "models/User.js"
the URI and port are in "config/keys.js"


### Insperations
the code was inspeired from other mangoDB login models 
