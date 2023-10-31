const Joi = require('@hapi/joi')

function getDefaultErr(label) {
  switch (label) {
    case 'First Name':
    case 'Last Name':
    case 'Email':
    default:
      return `Enter valid ${label}`
  }
}

function validationCommonErrHandler(errors) {
  return errors.map(err => {
    switch (err.type) {
      case 'any.empty':
      case 'any.required':
        return new Error(`${err.context.label} is required`)
      case 'string.regex.base':
        return new Error(`Please enter valid ${err.context.label}`)
      case 'email.base':
        return new Error(`${err.context.label} should be in email format`)
      case 'string.email':
        return new Error('Enter a valid Email')
      case 'string.base':
        return new Error(`${err.context.label} must be a string`)
      case 'string.max':
        return new Error(`${err.context.label} must be of max length ${err.context.limit}`)
      case 'string.min':
        return new Error(`${err.context.label} must be of min length ${err.context.limit}`)
      default:
        const error = getDefaultErr(err.context.label)
        return new Error(error)
    }
  })
}


function emailStringValidations(isRequired) {
  let schema;
  if (isRequired) {
    schema = Joi.string()
      .email()
      .regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
      .required()
      .error(validationCommonErrHandler);
  } else {
    schema = Joi.string()
      .email()
      .regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
      .optional()
      .allow('', null)
      .error(validationCommonErrHandler);
  }
  return schema;
}


module.exports = {
  validationCommonErrHandler,
  emailStringValidations
}