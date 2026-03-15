import { sequelize } from './index';

const start = async () => {
	try {
		await sequelize.sync({ alter: true });
		console.log('✅ All tables created');
	} catch (err) {
		console.error('❌ DB error:', err);
	}
};

start();
