const { customResponse } = require('../../lib/custom-response');
const { sendErrorResponse } = require('../../lib/errorResponse');

const LoginController = require('../../controllers/loginController/loginController');

async function loginHandler(req, res, next) {
  try {
    const result = await LoginController.login(req.body);
    res.set('AuthToken', result.data.token);
    res.set('TokenExpiresIn', result.data.expiresIn);
    delete result.data.token;
    customResponse(200, result, res);
  } catch (error) {
    sendErrorResponse(error, res);
  }
}

module.exports = loginHandler;
