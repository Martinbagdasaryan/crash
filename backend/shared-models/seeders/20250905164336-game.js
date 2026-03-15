'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.bulkInsert('games', [{ name: 'Avia Dream', providerName: "menq", hasDemoMode: true, limitMin: 1, limitMax: 100, state: true }]);
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.bulkDelete('games', null, {});
	},
};
