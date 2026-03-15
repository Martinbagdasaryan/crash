'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.bulkInsert('rounds', [
			{
				gameId: 1,
				coeficient: 1.0,
				SHA256Hash: 'abc123',
				hex: '0x123',
				dec: '123',
				serverSeed: 'serverSeed123',
				state: 1,
				createdAt: new Date(),
				updatedAt: new Date(),
			},
		]);
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.bulkDelete('rounds', null, {});
	},
};
