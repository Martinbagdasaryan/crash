import { Model, DataTypes, Optional, Sequelize } from 'sequelize';
import Players from './players';
import Rounds from './rounds';

interface PlayerSeedAttributes {
	id: number;
	playerId: number;
	roundId: number;
	seed: string;
	createdAt: Date;
}

type PlayerSeedCreationAttributes = Optional<PlayerSeedAttributes, 'id'>;

export default class PlayersSeeds
	extends Model<PlayerSeedAttributes, PlayerSeedCreationAttributes>
	implements PlayerSeedAttributes {
	public readonly id!: number;
	public playerId!: number;
	public roundId!: number;
	public seed!: string;
	public createdAt!: Date;

	static initModel(sequelize: Sequelize): typeof PlayersSeeds {
		PlayersSeeds.init(
			{
				id: {
					type: DataTypes.BIGINT,
					allowNull: false,
					autoIncrement: true,
					primaryKey: true,
				},
				playerId: {
					type: DataTypes.BIGINT,
					allowNull: false,
				},
				roundId: {
					type: DataTypes.BIGINT,
					allowNull: false,
				},
				seed: {
					type: DataTypes.STRING,
					allowNull: false,
				},
				createdAt: {
					type: DataTypes.DATE,
					allowNull: false,
					defaultValue: new Date(),
				},
			},
			{
				sequelize,
				tableName: 'players_seeds',
				timestamps: true,
				createdAt: true,
				updatedAt: false,
			},
		);
		return PlayersSeeds;
	}

	static associate() {
		PlayersSeeds.belongsTo(Players, { foreignKey: 'playerId' });
		PlayersSeeds.belongsTo(Rounds, { foreignKey: 'roundId' });
	}
}
