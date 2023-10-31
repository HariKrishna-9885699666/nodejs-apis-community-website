const _ = require("lodash");
const fs = require('fs');
const models = require("../../models");

class UserController {
  // Constructor can be added if necessary

  // Method to get user by ID
  static async getUserById(userId) {
    const user = await models.User.findByPk(userId, {
      attributes: { exclude: ["password", "id"] },
    });
    if (!user) {
      throw new Error("USER_NOT_FOUND");
    }

    const data = await new Promise((resolve, reject) => {
      fs.readFile(`./uploads/${user.profilePic}`, (err, data) => {
        if (err) reject(err);
        else resolve(data);
        })
    });
    
    const base64Image = await Buffer.from(data).toString('base64');
    user.profilePic = `data:image/jpeg;base64,${base64Image}`;
    return user;
  }

  // Method to get user by email
  static async getUserByEmail(email) {
    const user = await models.User.findOne({
      where: {
        email,
      },
    });
    if (!user) {
      throw new Error("USER_NOT_FOUND");
    }
    return user;
  }

  // Method to get a list of all users
  static async getAllUsers() {
    const users = await models.User.findAll();
    return users;
  }

  // Method to update user information
  static async updateUser(userId, updateData) {
    const user = await UserController.getUserById(userId);
    // Update the user's data using the updateData object
    // You may want to add validation and sanitation of the updateData here
    await user.update(updateData);
    return user;
  }

  // Method to delete a user by ID
  static async deleteUser(userId) {
    const user = await UserController.getUserById(userId);
    await user.destroy();
    return { message: "User deleted successfully" };
  }
}

module.exports = UserController;
