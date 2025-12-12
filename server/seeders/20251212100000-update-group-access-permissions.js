'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('GroupAccessModules', null, {});

    await queryInterface.bulkInsert('GroupAccessModules', [
      {
        groupAccessId: 1,
        moduleId: 1, 
        canCreate: false,
        canRead: true,
        canUpdate: false,
        canDelete: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        groupAccessId: 1,
        moduleId: 2, 
        canCreate: true,
        canRead: true,
        canUpdate: true,
        canDelete: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },

      {
        groupAccessId: 2,
        moduleId: 1, 
        canCreate: false,
        canRead: true,
        canUpdate: false,
        canDelete: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        groupAccessId: 2,
        moduleId: 2, 
        canCreate: true,
        canRead: true,
        canUpdate: true,
        canDelete: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        groupAccessId: 2,
        moduleId: 3, 
        canCreate: false,
        canRead: true,
        canUpdate: false,
        canDelete: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        groupAccessId: 2,
        moduleId: 4,
        canCreate: false,
        canRead: true,
        canUpdate: false,
        canDelete: false,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('GroupAccessModules', null, {});
  }
};
