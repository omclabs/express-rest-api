const { createLogger, transports, format } = require('winston');

const { timestamp, combine, printf } = format;
const myFormat = printf(
  // eslint-disable-next-line no-shadow
  ({ timestamp, level, message }) => `${timestamp} ${level} ${message}`,
);

const logger = createLogger({
  level: 'info',
  format: combine(timestamp(), myFormat),
  transports: [
    new transports.Console(),
    new transports.File({
      filename: './logs/error.log',
    }),
  ],
});

module.exports = logger;
