import { Sequelize } from 'sequelize';
import Currencies from '../models/currencies';
import DbErrors from '../models/dbErrors';
import Errors from '../models/errors';
import Games from '../models/games';
import Refunds from '../models/refunds';
import GamesTransactions from '../models/gamesTransactions';
import Players from '../models/players';
import PlayersSeeds from '../models/playersSeeds';
import Rounds from '../models/rounds';
import Partners from '../models/partners';

export const sequelize = new Sequelize({
	username: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_NAME,
	host: process.env.DB_HOST,
	port: Number(process.env.DB_PORT) || 5432,
	dialect: 'postgres',
	logging: false,
});

const models = {
	Currencies: Currencies.initModel(sequelize),
	DbErrors: DbErrors.initModel(sequelize),
	Errors: Errors.initModel(sequelize),
	Games: Games.initModel(sequelize),
	GamesTransactions: GamesTransactions.initModel(sequelize),
	Refunds: Refunds.initModel(sequelize),
	Partners: Partners.initModel(sequelize),
	Players: Players.initModel(sequelize),
	PlayersSeeds: PlayersSeeds.initModel(sequelize),
	Rounds: Rounds.initModel(sequelize),
};

interface AssociableModel {
	associate?: () => void;
}
Object.values(models).forEach((model) => {
	(model as AssociableModel).associate?.();
});

export default models;
