const winston = require("winston");

const winLogger = (lebel, serviceName, message) => {
  const logger = winston.createLogger({
    level: lebel,
    format: winston.format.json(),
    defaultMeta: { service: serviceName },
    transports: [
      new winston.transports.File({ filename: "error.log", level: "error" }),
      new winston.transports.File({ filename: "combined.log" }),
    ],
  });

  logger.log({
    level: lebel,
    message: message,
  });
};

module.exports = winLogger;
