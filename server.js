const mongoose = require('mongoose');
require('dotenv').config();

const app = require('./app');

const DB_URI =
  process.env.NODE_ENV === 'production'
    ? process.env.DB_PROD
    : process.env.DB_URI_LOCAL;

// const DB_URI = process.env.DB_PROD;
const PORT = process.env.PORT;

mongoose
  .connect(DB_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MONGO DB CONNECTED ...'));

app.listen(PORT, () =>
  console.log(`SERVER RUNNING (${process.env.NODE_ENV}) ON PORT ${PORT} ...`)
);
