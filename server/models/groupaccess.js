'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class GroupAccess extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      GroupAccess.hasMany(models.User, {
        foreignKey: 'groupAccessId'
      });
      
      GroupAccess.belongsToMany(models.Module, {
        through: models.GroupAccessModule,
        foreignKey: 'groupAccessId'
      });
      
      GroupAccess.hasMany(models.GroupAccessModule, {
        foreignKey: 'groupAccessId'
      });
    }
  }
  GroupAccess.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: {
          msg: 'Group name is required'
        },
        notNull: {
          msg: 'Group name is required'
        }
      }
    },
    description: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'GroupAccess',
  });
  return GroupAccess;
};