require('dotenv').config();

const PORT = process.env.PORT;
const SECRET = process.env.SECRET;
const NODE_ENV = process.env.NODE_ENV;
const MONGO_URI =
  NODE_ENV === 'test' ? process.env.MONGO_URI_TEST : process.env.MONGO_URI;

module.exports = {
  NODE_ENV,
  PORT,
  MONGO_URI,
  SECRET,
};
