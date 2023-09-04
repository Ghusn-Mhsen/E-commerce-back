let mongoose = require('mongoose');

require('dotenv').config()




class Database {
  constructor() {
  
    this._connect()
  }
_connect() {
     mongoose.connect( process.env.DATABASE_URL)
       .then(() => {
         console.log('Database connection successful')

       })
       .catch(err => {
        console.log(err)
         console.error('Database connection error ')
         loggerErrorApp.error(`Error connecting to MongoDB: ${err}`);
         process.exit(1);
       })
  }
}
module.exports = new Database()

