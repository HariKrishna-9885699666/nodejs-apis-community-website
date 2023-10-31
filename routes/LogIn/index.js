const router = require('express').Router()

const loginValidation = require('../../lib/validations').login

const loginHandler = require('./loginHandler')

router.post('', loginValidation, loginHandler)

module.exports = exports = router