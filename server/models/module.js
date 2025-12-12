'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Module extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Module.belongsToMany(models.GroupAccess, {
        through: models.GroupAccessModule,
        foreignKey: 'moduleId'
      });
      
      Module.hasMany(models.GroupAccessModule, {
        foreignKey: 'moduleId'
      });
      
      Module.belongsTo(models.Module, {
        as: 'parent',
        foreignKey: 'parentId'
      });
      
      Module.hasMany(models.Module,{
        as: 'children',
        foreignKey: 'parentId'
      })
    }
  }
  Module.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    routeName: DataTypes.STRING,
    icon: DataTypes.STRING,
    order: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    parentId: DataTypes.INTEGER,
    isActive: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Module',
  });
  return Module;
};