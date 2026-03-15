'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    		await queryInterface.bulkInsert('partners', [{ name: 'Demo', login: 'demo', password: 'demo' }]);
  },

  async down (queryInterface, Sequelize) {
    		await queryInterface.bulkDelete('partners', null, {});
  }
};
