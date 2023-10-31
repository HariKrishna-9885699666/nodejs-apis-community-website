'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Users', 'userType', {
      type: Sequelize.ENUM('ADMIN', 'CUSTOMER', 'MODERATOR'),
      defaultValue: 'CUSTOMER',
      allowNull: false,
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('Users', 'userType');
  }
};
