const router = require('express').Router();

// Handlers initialization
const logInHandler = require('./LogIn');
const registerHandler = require('./Register');
const userHandler = require('./User');

router.use('/login', logInHandler);
router.use('/register', registerHandler);
router.use('/user', userHandler);

module.exports = exports = router;