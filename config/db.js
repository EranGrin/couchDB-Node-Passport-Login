// this part is still not integrated in the code 
const dbNameCheck = (dbName) => {
    
    couchDb.list().then(
        erg => { console.log( erg )
            if ( !erg.includes(dbName) ) return couchDb.create(dbName);
            else return true;
        }
    ).then(
        () => { 
          console.log( dbName, 'is loaded' )
          return dbName
       }
    )
    
}
module.exports = dbNameCheck;

