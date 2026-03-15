import { Model, DataTypes, Optional, Sequelize } from 'sequelize';

interface PartnerGameAttributes {
	id: number;
	partnerId: number;
	gameId: number;
}

type PartnerGameCreationAttributes = Optional<PartnerGameAttributes, 'id'>;

export default class PartnerGame extends Model<PartnerGameAttributes, PartnerGameCreationAttributes> implements PartnerGameAttributes {
	public readonly id!: number;
	public partnerId!: number;
	public gameId!: number;

	static initModel(sequelize: Sequelize): typeof PartnerGame {
		PartnerGame.init(
			{
				id: {
					type: DataTypes.BIGINT,
					allowNull: false,
					autoIncrement: true,
					primaryKey: true,
				},
				partnerId: {
					type: DataTypes.INTEGER,
					primaryKey: true,
					references: { model: 'partners', key: 'id' },
					onDelete: 'CASCADE',
				},
				gameId: {
					type: DataTypes.INTEGER,
					primaryKey: true,
					references: { model: 'games', key: 'id' },
					onDelete: 'CASCADE',
				},
			},
			{
				sequelize,
				tableName: 'partner_games',
				timestamps: false,
			}
		);
		return PartnerGame;
	}
}
