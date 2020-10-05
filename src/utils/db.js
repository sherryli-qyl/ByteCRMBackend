const mongoose = require('mongoose');

exports.connectToDB = () => {
            const {
            DB_HOST,
            DB_DATABASE,
            DB_PORT,
            DB_USER,
            DB_PASSWORD,
            NODE_ENV
        } = process.env;
        let connectionString;
        if(NODE_ENV === 'production'){
            if(DB_USER && DB_PASSWORD)
            connectionString = `mongodb+srv://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/${DB_DATABASE}`;
            // connectionString = `mongodb://localhost:27017/jr-cms-105`;
        } else {
            const connectionString = `mongodb://${DB_HOST}:${DB_PORT}/${DB_DATABASE}`;
        }

        const db = mongoose.connection;
        db.on('connected', () => {
        console.log(`DB connected, ${connectionString}`);
        });
        db.on('error',(error)=> {
        console.log('DB connection failed');
        console.error(error.message);
        process.exit(1);
        });
        db.on('disconnected',() => {
        console.log('mongoose connection is disconnected');
         });

        mongoose.connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true
   });
};