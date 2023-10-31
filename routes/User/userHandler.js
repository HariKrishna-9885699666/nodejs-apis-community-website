const { customResponse } = require('../../lib/custom-response')
const { sendErrorResponse } = require('../../lib/errorResponse')

const UserController = require('../../controllers/userController/userController')

async function userHandler(req, res, next) {
  try {
    const result = await UserController.getUserById(req.params.id);
    customResponse(200, result, res)
  } catch (error) {
    sendErrorResponse(error, res)
  }
}

module.exports = userHandler
