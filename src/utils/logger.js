const { createLogger, format, transports } = require('winston');     //Asynchronous Logging

const { combine, timestamp, json, colorize } = format;

// Custom format for console logging with colors

const consoleLogFormat = format.combine(
  format.colorize(),

  format.printf(({ level, message, timestamp }) => {
    return `${level}: ${message}`;
  })
);

// Create a Winston logger

const logger = createLogger({
  level: "info",

  format: combine(colorize(), timestamp(), json()),

  transports: [
    new transports.Console({
      format: consoleLogFormat,
    }),

    new transports.File({ filename: "app.log" })  //file path should be masked
    ],
    exceptionHandlers: [
        new transports.File({ filename: 'exceptions.log' })  // Handle uncaught exceptions and log them to a file
      ]
       
});

// Export the logger for use in other modules
module.exports = logger;

// logger.info("This is an info message");
// logger.error("This is an error message");
// logger.warn("This is a warning message");
// logger.debug("This is a debug message");