const {
  customResponse
} = require('../../lib/custom-response');
const {
  sendErrorResponse
} = require('../../lib/errorResponse');

const RegisterController = require('../../controllers/registerController/registerController');

async function registerHandler(req, res, files, next) {
  try {
    const result = await RegisterController.register(req.body, files);
    customResponse(200, result, res);
  } catch (error) {
    sendErrorResponse(error, res);
  }
}

module.exports = registerHandler;