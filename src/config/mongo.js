const pino = require("pino");
const logger = require("../utils/logger")
const mongoose = require('mongoose');

// /config/db.js
const logger2 = pino();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI_LOCAL);
    logger2.info(`MongoDB Connected: ${conn.connection.host}`);
    logger.info(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    // logger.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
