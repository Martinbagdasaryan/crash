import { sequelize } from './index';

export const setDbConnection = async () => {
	try {
		await sequelize.authenticate();
		console.log('✅ Database connected');
	} catch (err) {
		console.error('❌ DB error:', err);
	}
};
