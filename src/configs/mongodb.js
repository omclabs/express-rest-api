const mongoose = require('mongoose');
const logger = require('./logger');

const connString = `mongodb://${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_DB}`;
const connOptions = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
};

mongoose.connect(connString, connOptions);

mongoose.connection.on('connected', () => {
  logger.info({
    message: `Connected to MongoDB at ${process.env.MONGO_HOST}:${process.env.MONGO_PORT}`,
  });
});

mongoose.connection.on('error', (err) => {
  logger.info({
    message: `Error when Connecting to MongoDB ${err}`,
  });
});

mongoose.connection.on('disconnected', () => {
  logger.info({
    message: `Disconnected from MongoDB at ${process.env.MONGO_HOST}:${process.env.MONGO_PORT}`,
  });
});

process.on('SIGINT', () => {
  mongoose.connection.close(() => {
    logger.info({
      message: 'MongoDB disconnected through app termination',
    });
    process.exit(0);
  });
});
