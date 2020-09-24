require('dotenv').config();

const express = require('express');
require('express-async-errors');

const routes = require('./routes');

const { connectToDB } = require('./utils/db'); 
const errorHandler = require('./middleware/errorHandler');

const app =  express();

app.use (express.json());//get data from req.body needs app.use(express.json())
app.use('/api', routes);

app.use(errorHandler);

connectToDB()

app.listen(3000, () => {
    console.log('server listening')
});   
