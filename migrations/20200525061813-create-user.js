'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID, // Change the type to UUID
        defaultValue: Sequelize.UUIDV4, // Generate UUIDs as primary keys
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false
      },
      fatherName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      address: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      natureOfWork: {
        type: Sequelize.STRING,
        allowNull: false
      },
      cellNumber: {
        type: Sequelize.CHAR(10),
        allowNull: false
      },
      education: {
        type: Sequelize.STRING,
        allowNull: false
      },
      dateOfBirth: {
        type: Sequelize.DATE,
        allowNull: false
      },
      placeOfBirth: {
        type: Sequelize.STRING
      },
      aadharNumber: {
        type: Sequelize.CHAR(12)
      },
      bloodGroup: {
        type: Sequelize.STRING
      },
      profilePic: {
        type: Sequelize.STRING,
        allowNull: false
      },
      digitalSignature: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Users');
  }
};
