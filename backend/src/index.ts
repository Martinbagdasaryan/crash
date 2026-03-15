import express from 'express';
import http from 'http';
import { setDbConnection } from 'dbSrc/connect';
import userRoutes from './routes/routes';
import { initSocket } from './socket';
import cors from 'cors';
import compression from 'compression';

const app = express();

const api = express.Router();

api.use(compression());
api.use(express.json());

api.use(
	cors({
		origin: process.env.VITE_FRONT_URL,
		credentials: true,
	}),
);

api.use('/user', userRoutes);

app.use('/api', api);

const server = http.createServer(app);
initSocket(server);

const start = async () => {
	try {
		await setDbConnection();
		server.listen(8100, '0.0.0.0', () => {
			console.log('🚀 Server running on http://localhost:8100');
		});
	} catch (err) {
		console.error('❌ DB error:', err);
	}
};

start();
