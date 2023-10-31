'use strict';
module.exports = (sequelize, DataTypes) => {
    const FamilyMember = sequelize.define('FamilyMember', {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      age: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      relation: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
    }, {
      tableName: 'FamilyMembers',
    });
  
    FamilyMember.associate = function(models) {
      // Define associations with other models if needed
      FamilyMember.belongsTo(models.User, { foreignKey: 'userId' });
    };
  
    return FamilyMember;
  };
  