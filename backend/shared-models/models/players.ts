import { Model, DataTypes, Optional, Sequelize } from 'sequelize';
import Currencies from './currencies';
import Partners from './partners';

interface PlayerAttributes {
	id: number;
	partnerPlayerId: string;
	firstName?: string;
	lastName?: string;
	email?: string;
	gender?: string;
	username?: string;
	nickName: string;
	partnerId: string;
	socketId?: string;
	balance: number;
	currencyId: string;
}

type PlayerCreationAttributes = Optional<PlayerAttributes, 'id'>;

export default class Players extends Model<PlayerAttributes, PlayerCreationAttributes> implements PlayerAttributes {
	public readonly id!: number;
	public partnerPlayerId!: string;
	public firstName?: string;
	public lastName?: string;
	public email?: string;
	public gender?: string;
	public username?: string;
	public nickName!: string;
	public partnerId!: string;
	public socketId?: string;
	public balance!: number;
	public currencyId!: string;

	static initModel(sequelize: Sequelize): typeof Players {
		Players.init(
			{
				id: {
					type: DataTypes.BIGINT,
					allowNull: false,
					autoIncrement: true,
					primaryKey: true,
				},
				partnerPlayerId: {
					type: DataTypes.STRING,
					allowNull: false,
				},
				firstName: {
					type: DataTypes.STRING,
				},
				lastName: {
					type: DataTypes.STRING,
				},
				email: {
					type: DataTypes.STRING,
				},
				gender: {
					type: DataTypes.STRING,
				},
				username: {
					type: DataTypes.STRING,
				},
				nickName: {
					type: DataTypes.STRING,
					allowNull: false,
					unique: true,
				},
				partnerId: {
					type: DataTypes.BIGINT,
					allowNull: false,
				},
				socketId: {
					type: DataTypes.STRING,
					unique: true,
				},
				balance: {
					type: DataTypes.DECIMAL(8),
					allowNull: false,
				},
				currencyId: {
					type: DataTypes.STRING,
					allowNull: false,
				},
			},
			{
				sequelize,
				tableName: 'players',
				timestamps: false,
				indexes: [
					{
						unique: true,
						fields: ['partnerPlayerId', 'partnerId'],
						name: 'unique_partnerPlayerId_partnerId',
					},
				],
			}
		);
		return Players;
	}

	static associate() {
		Players.belongsTo(Currencies, { foreignKey: 'currencyId' });
		Players.belongsTo(Partners, { foreignKey: 'partnerId' });
	}
}
