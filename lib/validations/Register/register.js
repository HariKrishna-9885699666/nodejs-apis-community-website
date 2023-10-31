const Joi = require('@hapi/joi')
const {
  validationCommonErrHandler,
  emailStringValidations
} = require('../commonValidations')
const {
  loggerMessage
} = require('../../logger')

function stringNameValidations(
  regex,
  isRequired
) {
  let schema
  if (isRequired) {
    schema = Joi.string()
      .required()
      .regex(regex)
  } else {
    schema = Joi.string()
      .optional()
      .regex(regex)
      .allow('', null)
  }
  return schema
}

function validateRegister(req, res, next) {
  loggerMessage('start', req);
  const data = req.body
  const isEmailReq = emailStringValidations(true)
  let isNameReq = stringNameValidations(/^[a-zA-Z-'.\s\u00C0-\u017F]*$/, true)

  const schema = {
    name: isNameReq.label("Name").error(validationCommonErrHandler),
    email: isEmailReq.label("Email").error(validationCommonErrHandler),
    password: Joi.string()
      .required()
      .min(6)
      .max(12)
      .regex(/^\S*$/)
      .label("Password")
      .error(validationCommonErrHandler),
    fatherName: isNameReq
      .label("Father Name")
      .error(validationCommonErrHandler),
    address: Joi.string()
      .required()
      .label("Address")
      .error(validationCommonErrHandler),
    natureOfWork: isNameReq
      .label("Nature of Work")
      .error(validationCommonErrHandler),
    cellNumber: Joi.string()
      .required()
      .label("Cell Number")
      .error(validationCommonErrHandler),
    education: isNameReq.label("Education").error(validationCommonErrHandler),
    dateOfBirth: Joi.date()
      .label("Date of Birth")
      .error(validationCommonErrHandler),
    placeOfBirth: Joi.string().label("Place of Birth").empty(""),
    aadharNumber: Joi.string()
      .regex(/^\d{12}$/)
      .label("Aadhar Number")
      .empty(""),
    bloodGroup: Joi.string().label("Blood Group").empty(""),
    profilePic: Joi.any()
      .label("Profile Picture")
      .error(validationCommonErrHandler),
    digitalSignature: Joi.any()
      .label("Digital Signature")
      .error(validationCommonErrHandler),
    familyMembers: Joi.array().items(Joi.object()),
  };

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

module.exports = exports = validateRegister