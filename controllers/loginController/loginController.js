const _ = require('lodash')
const md5 = require('md5')
const jwt = require('jsonwebtoken')
const models = require('../../models')

const jwtKey = process.env.JWT_SECRET
const jwtExpirySeconds = process.env.JWT_EXPIRY_SECONDS

class LoginController {
  constructor(id) {
    this.id = id
  }

  static async isUserExists(email) {
    const user = await models.User.findOne({
      where: {
        email,
        isActive: 1
      }
    })
    if (!user) {
      throw new Error('USER_NOT_FOUND')
    }
    return user
  }

  static async loginCheck(obj) {
    const user = await models.User.findOne({
      where: {
        email: obj.email,
        password: obj.password,
      }
    })
    if (!user) {
      throw new Error('INVALID_USER_PWD')
    }
    return user
  }

  static async login(payload) {
    try {
      await LoginController.isUserExists(
        _.get(payload, 'email')
      )

      let reqBody = {
        email: _.get(payload, 'email'),
        password: md5(_.get(payload, 'password')),
      }

      const userInfo = await LoginController.loginCheck(reqBody)

      const email = reqBody.email;
      const userId = userInfo.id;
      const token = jwt.sign({ email, userId }, jwtKey, {
        algorithm: 'HS256',
        expiresIn: parseInt(jwtExpirySeconds),
      });

      return {
        success: true,
        data: {
          message: 'Login Successful',
          email,
          token,
          name: `${userInfo.name}`,
          userType: `${userInfo.userType}`,
          expiresIn: parseInt(jwtExpirySeconds),
        },
      }
    } catch (error) {
      throw error
    }
  }
}

module.exports = LoginController
