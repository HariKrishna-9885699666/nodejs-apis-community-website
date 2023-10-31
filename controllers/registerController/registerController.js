const _ = require('lodash');
const md5 = require('md5');
const fs = require('fs');
const path = require('path');
const brevo = require('@getbrevo/brevo');
const models = require('../../models');

class RegisterController {
  constructor(id) {
    this.id = id;
  }

  /**
   * Check if a user with the provided email already exists.
   *
   * @param {string} email - The email address to check for existence.
   * @param {object} transaction - The Sequelize transaction object.
   * @returns {object|null} - The user object if found, otherwise null.
   */
  static async isUserExists(email, transaction) {
    const user = await models.User.findOne({
      where: {
        email,
      },
      transaction,
    });
    if (user) {
      throw new Error('USER_ALREADY_FOUND');
    }
    return user;
  }

  /**
   * Create a new user based on the payload data.
   *
   * @param {object} payload - User registration data.
   * @param {object} transaction - The Sequelize transaction object.
   * @returns {object} - The created user object.
   */
  static async createUser(payload, files, transaction) {
    const reqBody = {
      name: _.get(payload, 'name'),
      email: _.get(payload, 'email'),
      password: md5(_.get(payload, 'password')),
      fatherName: _.get(payload, 'fatherName'),
      address: _.get(payload, 'address'),
      natureOfWork: _.get(payload, 'natureOfWork'),
      cellNumber: _.get(payload, 'cellNumber'),
      education: _.get(payload, 'education'),
      dateOfBirth: _.get(payload, 'dateOfBirth'),
      placeOfBirth: _.get(payload, 'placeOfBirth'),
      aadharNumber: _.get(payload, 'aadharNumber'),
      bloodGroup: _.get(payload, 'bloodGroup'),
      profilePic: _.get(files, 'profilePic'), 
      digitalSignature: _.get(files, 'digitalSignature'),
    };

    return models.User.create(reqBody, { transaction });
  }

  /**
   * Insert family members if they exist in the payload.
   *
   * @param {object} payload - User registration data, including family members.
   * @param {object} registerUser - The registered user object.
   * @param {object} transaction - The Sequelize transaction object.
   */
  static async insertFamilyMembers(payload, registerUser, transaction) {
    const familyMembersData = _.get(payload, 'familyMembers', []);
    if (familyMembersData.length > 0) {
      const familyMembers = familyMembersData.map(member => ({
        name: member.name,
        age: member.age,
        relation: member.relation,
        userId: registerUser.id,
      }));
      await models.FamilyMember.bulkCreate(familyMembers, { transaction });
    }
  }


  static async sendEmail(payload) {
    let defaultClient = brevo.ApiClient.instance;
    let apiKey = defaultClient.authentications['api-key'];
    apiKey.apiKey = process.env.BREVO_API;

    let apiInstance = new brevo.TransactionalEmailsApi();
    let sendSmtpEmail = new brevo.SendSmtpEmail();

    sendSmtpEmail.subject = "Registration Successful - Your account is in the process of activation";
    sendSmtpEmail.htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Registration Confirmation</title>
    </head>
    <body style="font-family: Arial, Helvetica, sans-serif; font-size: 16px; line-height: 1.5; padding: 20px;">
      <div style="text-align: center;">
      <img src="https://i.ibb.co/vPpxnfD/logo.png" alt="Company Logo" width="534" height="187"> 
      </div>
      <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px;">
        <h2 style="margin-top: 0;">Thanks for registering!</h2>
        <p style="margin-bottom: 10px;">Hi ${_.get(payload, 'name')},</p>
        <p style="margin-bottom: 10px;">Thank you for registering with welfarehub.org. Your account will be activated soon.</p>
        <p style="margin-bottom: 10px;">Once activated, you will receive another email with instructions to login to your account.</p>
        <p style="margin-bottom: 10px;">We look forward to providing you with our services!</p>
        <p style="margin-bottom: 0;">Sincerely,</p>
        <p style="margin: 0;">The Welfarehub Team</p>
      </div>
    </body>
    </html>
    `;
    sendSmtpEmail.sender = { "name": "Welfarehub", "email": "sivaprasad.cs51@gmail.com" };
    sendSmtpEmail.to = [
      { "email": _.get(payload, 'email'), "name": _.get(payload, 'name') }
    ];

    apiInstance.sendTransacEmail(sendSmtpEmail).then(function (data) {
      console.log('API called successfully. Returned data: ' + JSON.stringify(data));
      console.log('API called successfully. Returned data: ' + _.get(payload, 'email') + _.get(payload, 'name'));
    }, function (error) {
      console.error(error);
    });

  }

  /**
   * Cleanup uploaded files, if any.
   *
   * @param {object} files - The uploaded files associated with the registration.
   */
  static async cleanupFiles(files) {
    if (_.get(files, 'profilePic')) {
      const filePath1 = path.join(__dirname, '..', '..', 'uploads', _.get(files, 'profilePic'));
      fs.unlink(filePath1, (err1) => {
        // Handle errors or perform additional cleanup steps if necessary
      });
    }
    if (_.get(files, 'digitalSignature')) {
      const filePath2 = path.join(__dirname, '..', '..', 'uploads', _.get(files, 'digitalSignature'));
      fs.unlink(filePath2, (err2) => {
        // Handle errors or perform additional cleanup steps if necessary
      });
    }
  }

  /**
   * Main registration function.
   *
   * @param {object} payload - User registration data.
   * @param {object} files - Uploaded files associated with the registration.
   * @returns {object} - The registered user object (with the password omitted).
   */
  static async register(payload, files) {
    let transaction;
    try {
      transaction = await models.sequelize.transaction();
      await this.isUserExists(_.get(payload, 'email'), transaction);

      const registerUser = await this.createUser(payload, files, transaction);
      await this.insertFamilyMembers(payload, registerUser, transaction);
      await this.sendEmail(payload);
      await transaction.commit();

      // Omit the password from the response
      delete registerUser.dataValues.password;
      return registerUser;
    } catch (error) {
      this.cleanupFiles(files);
      if (transaction) await transaction.rollback();
      throw error;
    }
  }
}

module.exports = RegisterController;
