const mongoose = require('mongoose');
const config = require('config');

const db = config.get("mongoURI")

const connectionDB = async () => {
    try {
       await mongoose.connect(db, {
           useNewUrlParser: true,
           useUnifiedTopology: true,
       });

       console.log('DB connected');
    } catch(error) {
        console.error(error.message)

        //exit process on failure 
        process.exit(1)
    }
}

module.exports = connectionDB;