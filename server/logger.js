const winston = require("winston");
const format = winston.format;
const transports = winston.transports;

const loggerFactory = moduleName => {
  var logger = winston.createLogger({
    level: "info",
    format: format.combine(
      format.colorize(),
      format.timestamp({
        format: "YYYY-MM-DD HH:mm:ss"
      }),
      format.printf(
        info =>
          `${info.timestamp} [${moduleName}] ${info.level}: ${info.message}`
      )
    ),
    transports: [
      //
      // - Write to all logs with level `info` and below to `combined.log`
      // - Write all logs error (and below) to `error.log`.
      //
      new transports.File({
        filename: "combined.log",
        formatter: options => {
          return moduleName + " - " + (options.message ? options.message : "");
        }
      })
    ]
  });

  //
  // If we're not in production then log to the `console` with the format:
  // `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
  //
  if (process.env.NODE_ENV !== "production") {
    logger.add(new transports.Console());
  }

  return logger;
};

module.exports = moduleName => loggerFactory(moduleName);
