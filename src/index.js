// require to read .env file
require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const apiRoutes = require('./routes');

const app = express();

// tell express to use cors
app.use(cors());
app.options('*', cors());

// tell express to use body parser
app.use(bodyParser.json());

app.use('/api', apiRoutes);

app.listen(process.env.APP_PORT,
() => console.log(`app listening on port ${process.env.APP_PORT}!`)
);
