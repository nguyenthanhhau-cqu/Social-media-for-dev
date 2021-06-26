

const config = require('config');
const mongoose = require('mongoose');
const db = config.get('MongoURL');

const connectDB = async() => {
    try {
        await mongoose.connect(db,{ useNewUrlParser: true,useUnifiedTopology: true, useCreateIndex:true });
        console.log("database connect sucessfully");
    }catch(err) {
        console.log(err.message);
        // exit the system with failure
        process.exit(1);
    }
}

module.exports = connectDB;