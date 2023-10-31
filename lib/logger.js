/*
 *  Application Logger.
 *
 *  Docs: https://github.com/winstonjs/winston
 */

const winston = require('winston')
const DailyRotateFile = require('winston-daily-rotate-file')

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(info => {
      return `${info.timestamp} ${info.level}: ${JSON.stringify(info.message)}`
    })
  )
})


if (!process.env.NODE_ENV) {
  logger.add(new winston.transports.Console())
} else {
  const logFileTransport = new DailyRotateFile({
    filename: `logs/node-${process.env.NODE_ENV || 'dev'}-%DATE%.log`,
    datePattern: 'YYYY-MM-DD-HH',
    zippedArchive: true,
    maxSize: '10m',
    maxFiles: '5d'
  })
  logger.add(logFileTransport)
}

const loggerMessage = (type, req) => {
  if (type === 'start') {
    logger.info('############################################ API - START ########################################')
    logger.info(req.originalUrl)
    logger.info(req.headers)
    logger.info(req.body)
  } else if (type === 'end') {
    logger.info('############################################ API - END #########################################')
  } else if (type === 'success') {
    logger.info(req)
  } else if (type === 'error') {
    logger.error(req)
  }
}

module.exports = {
  logger,
  loggerMessage
}