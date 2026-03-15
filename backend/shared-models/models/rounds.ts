import { Model, DataTypes, Optional, Sequelize } from 'sequelize';
import Games from './games';
import GamesTransactions from './gamesTransactions';

interface RoundAttributes {
	id: number;
	gameId: number;
	coeficient: number;
	SHA256Hash: string;
	hex: string;
	dec: number;
	serverSeed?: string | null;
	state: number;
	createdAt: Date;
	updatedAt: Date;
}

type RoundCreationAttributes = Optional<RoundAttributes, 'id' | 'serverSeed' | 'updatedAt'>;

export default class Rounds extends Model<RoundAttributes, RoundCreationAttributes> implements RoundAttributes {
	public readonly id!: number;
	public gameId!: number;
	public totalwins!: number | null;
	public totalbets!: number | null;
	public coeficient!: number;
	public SHA256Hash!: string;
	public hex!: string;
	public dec!: number;
	public serverSeed!: string | null;
	public state!: number;
	public createdAt!: Date;
	public updatedAt!: Date;

	static initModel(sequelize: Sequelize): typeof Rounds {
		Rounds.init(
			{
				id: {
					type: DataTypes.BIGINT,
					allowNull: false,
					autoIncrement: true,
					primaryKey: true,
				},
				gameId: {
					type: DataTypes.INTEGER,
					allowNull: false,
				},
				coeficient: {
					type: DataTypes.FLOAT,
					allowNull: false,
				},
				SHA256Hash: {
					type: DataTypes.STRING,
					allowNull: false,
				},
				hex: {
					type: DataTypes.STRING,
					allowNull: false,
				},
				dec: {
					type: DataTypes.BIGINT,
					allowNull: false,
				},
				serverSeed: {
					type: DataTypes.STRING,
				},
				state: {
					type: DataTypes.INTEGER,
					allowNull: false,
				},
				createdAt: {
					type: DataTypes.DATE,
					allowNull: false,
				},
				updatedAt: {
					type: DataTypes.DATE,
					allowNull: false,
				},
			},
			{
				sequelize,
				tableName: 'rounds',
				timestamps: true,
			}
		);
		return Rounds;
	}

	static associate() {
		Rounds.belongsTo(Games, { foreignKey: 'gameId' });
		Rounds.hasMany(GamesTransactions, { foreignKey: 'roundId' });
	}
}
