const mongoose = require('mongoose');




/**This module is used to connect to the mongo database. It uses the mongoose object modeling tool to  
 * connect to the database backend using the MONG_URI that can be found in the "/config/config.env" 
 * enviromental file. This is where the Mongo database server and port can be found and changed
 */
const connectDB =  async() => {

    try{
        await mongoose.connect(process.env.MONGO_URI, {
        //used to prevent deprecated warnings
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
        useFindAndModify: true
    });


        /* Display message in the console if the connection is successful. */
        //mongoose.connection.once('open', () => {
        //console.log('connected!')
        //});

        console.log('MongoDB is connected');

    }catch{
        console.log(`Error: ${err.message}`);
        process.exit(1);

    }
}


module.exports = connectDB;
