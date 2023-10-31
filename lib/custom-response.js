const {
  loggerMessage
} = require('./logger')

const errorCodes = {
  400: 'Bad Request',
  500: 'Internal Server Error',
  401: 'User Not Authorized',
  404: 'Not found'
}

function customResponse(statusCode, data, res) {
  if ([200, 201, 301].indexOf(statusCode) > -1) {
    res.statusCode = statusCode
    const successResp = {
      success: true,
      data: data
    };
    res.send(successResp)
    loggerMessage('success', successResp)
  } else {
    res.statusCode = statusCode
    const errorResp = {
      success: false,
      errorCode: errorCodes[statusCode] || 'Error',
      message: data.message || data,
      statusCode: statusCode
    }
    res.send(errorResp)
    loggerMessage('error', errorResp)
  }
  loggerMessage('end');
}

module.exports = {
  customResponse
}