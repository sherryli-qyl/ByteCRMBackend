require('dotenv').config();
require('express-async-errors');
const express = require('express');
const helmet = require ('helmet');
const morgan = require('morgan');
const cors = require('cors');

const routes = require('./routes');
const { connectToDB } = require('./utils/db'); 
const errorHandler = require('./middleware/errorHandler');

const app =  express();
const PORT = process.env.PORT || 3000;
const morganLog = 
  process.env.NODE_ENV === 'production' ? morgan ('common') : morgan('dev');

app.use(helmet());
app.use(morganLog);
app.use(cors({
  exposedHeaders: 'X-AUTH-TOKEN',
}));
app.use (express.json());//get data from req.body needs app.use(express.json())

app.get('/', (req, res) => {
  return res.json('welcome to jr cms')
});

app.use('/api', routes);

app.use(errorHandler);

connectToDB()

app.listen(PORT, () => {
    //winston need to replace all console.log
    console.log(`listening on port ${PORT}`);
});   
