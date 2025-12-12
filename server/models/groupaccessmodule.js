'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class GroupAccessModule extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      GroupAccessModule.belongsTo(models.GroupAccess, {
        foreignKey: 'groupAccessId'
      });
      
      GroupAccessModule.belongsTo(models.Module, {
        foreignKey: 'moduleId'
      });
    }
  }
  GroupAccessModule.init({
    groupAccessId: DataTypes.INTEGER,
    moduleId: DataTypes.INTEGER,
    canCreate: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    canRead: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    canUpdate: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    canDelete: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    sequelize,
    modelName: 'GroupAccessModule',
  });
  return GroupAccessModule;
};