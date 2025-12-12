'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('GroupAccessModules', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      groupAccessId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'GroupAccesses',
          key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      moduleId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Modules',
          key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      canCreate: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      canRead: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      canUpdate: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      canDelete: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
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
    await queryInterface.addConstraint('GroupAccessModules', {
      fields: ['groupAccessId', 'moduleId'],
      type: 'unique',
      name: 'unique_group_module'
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('GroupAccessModules');
  }
};