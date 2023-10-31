const errorCodes = require('../error-codes.json')
const {
  loggerMessage
} = require('./logger')

exports.sendErrorResponse = (error, res) => {
  const errorObj = errorCodes[error.message] ? errorCodes[error.message] : {
    statusCode: error.statusCode || 500,
    error: error.message
  }
  const errorResp = {
    success: false,
    error: errorObj.error,
    errorCode: error.message || error.name,
    statusCode: errorObj.statusCode
  };
  res.status(errorObj.statusCode)
    .send(errorResp)
  loggerMessage('error', errorResp)
  loggerMessage('end');
}