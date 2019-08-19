require('dotenv').config();

const mongoose  = require('mongoose');

mongoose.connect(
  `mongodb://${process.env.DATABASE_HOST}/${process.env.DATABASE_NAME}`,
  { useNewUrlParser: true }
);

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('MongoDB status: connected !');
});

module.exports = mongoose;