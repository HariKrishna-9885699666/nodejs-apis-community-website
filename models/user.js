'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    fatherName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    natureOfWork: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    cellNumber: {
      type: DataTypes.CHAR(10),
      allowNull: false,
    },
    education: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    dateOfBirth: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    placeOfBirth: {
      type: DataTypes.STRING,
    },
    aadharNumber: {
      type: DataTypes.CHAR(12),
    },
    bloodGroup: {
      type: DataTypes.STRING,
    },
    profilePic: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    digitalSignature: {
      type: DataTypes.STRING,
    },
    userType: {
      type: DataTypes.ENUM('ADMIN', 'CUSTOMER', 'MODERATOR'),
      defaultValue: 'CUSTOMER',
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: false, // 0 indicates "false" or "not active"
    },
  }, {
    tableName: 'Users',
  });

  User.associate = function(models) {
    // Define associations with other models if needed
  };

  return User;
};
