const Joi = require('@hapi/joi')
const {
  validationCommonErrHandler,
  emailStringValidations
} = require('../commonValidations')
const {
  loggerMessage
} = require('../../logger')

function validateLogin(req, res, next) {
  loggerMessage('start', req);
  const data = req.body
  const isEmailReq = emailStringValidations(true)

  const schema = {
    email: isEmailReq.label('Email').error(validationCommonErrHandler),
    password: Joi.string().required().label('Password').error(validationCommonErrHandler)
  }

  Joi.validate(data, schema, (err, value) => {
    if (err) {
      loggerMessage('error', err);
      res.status(422).json({
        message: err.message
      })
    } else {
      next()
    }
  })
}

module.exports = exports = validateLogin