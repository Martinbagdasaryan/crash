import { Model, DataTypes, Optional, Sequelize } from 'sequelize';
import Rounds from './rounds';

interface GameAttributes {
	id: number;
	name: string;
	providerName: string;
	hasDemoMode: boolean;
	limitMin: number;
	limitMax: number;
	state: boolean;
}

type GameCreationAttributes = Optional<GameAttributes, 'id'>;

export default class Games
	extends Model<GameAttributes, GameCreationAttributes>
	implements GameAttributes {
	public readonly id!: number;
	public name!: string;
	public providerName!: string;
	public hasDemoMode!: boolean;
	public limitMin!: number;
	public limitMax!: number;
	public state!: boolean;

	static initModel(sequelize: Sequelize): typeof Games {
		Games.init(
			{
				id: {
					type: DataTypes.BIGINT,
					allowNull: false,
					autoIncrement: true,
					primaryKey: true,
				},
				name: {
					type: DataTypes.STRING,
					allowNull: false,
				},
				providerName: {
					type: DataTypes.STRING,
					allowNull: false,
				},
				hasDemoMode: {
					type: DataTypes.BOOLEAN,
					allowNull: false
				},
				limitMin: {
					type: DataTypes.INTEGER,
					allowNull: false,
				},
				limitMax: {
					type: DataTypes.INTEGER,
					allowNull: false,
				},
				state: {
					type: DataTypes.BOOLEAN,
					allowNull: false
				},
			},
			{
				sequelize,
				tableName: 'games',
				timestamps: false,
			},
		);
		return Games;
	}

	static associate() {
		Games.hasMany(Rounds, { foreignKey: 'gameId' });
	}
}
