import { Model, DataTypes, Optional, Sequelize } from 'sequelize';
import Players from './players';
import Currencies from './currencies';
import Rounds from './rounds';
import { OperationType } from '../src/enums';

interface GameTransactionAttributes {
	id: number;
	playerId: number;
	roundId: number;
	amount: number;
	currencyId: string;
	winAmount: number;
	odds: number;
	index: number;
	referenceId: string;
	operationType: OperationType;
	sessionId: string;
	state: number;
	createdAt: Date;
	updatedAt: Date;
}

type GameTransactionCreationAttributes = Optional<
	GameTransactionAttributes,
	'id' | 'winAmount' | 'operationType' | 'updatedAt' | "odds"
>;

export default class GamesTransactions
	extends Model<GameTransactionAttributes, GameTransactionCreationAttributes>
	implements GameTransactionAttributes {
	public readonly id!: number;
	public playerId!: number;
	public roundId!: number;
	public amount!: number;
	public currencyId!: string;
	public winAmount!: number;
	public odds! : number;
	public index!: number;
	public referenceId!: string;
	public operationType!: OperationType;
	public sessionId!: string;
	public state!: number;
	public createdAt!: Date;
	public updatedAt!: Date;

	static initModel(sequelize: Sequelize): typeof GamesTransactions {
		GamesTransactions.init(
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
				currencyId: {
					type: DataTypes.STRING,
					allowNull: false,
				},
				roundId: {
					type: DataTypes.BIGINT,
					allowNull: false,
				},
				amount: {
					type: DataTypes.DECIMAL(20, 2),
					allowNull: false,
				},
				winAmount: {
					type: DataTypes.DECIMAL(20, 2),
					allowNull: false,
					defaultValue: 0,
				},
				odds: {
					type: DataTypes.DECIMAL(20, 2),
					defaultValue: 0,
				},
				index: {
					type: DataTypes.INTEGER,
					allowNull: false,
				},
				referenceId: {
					type: DataTypes.STRING,
					allowNull: false,
				},
				operationType: {
					type: DataTypes.INTEGER,
					allowNull: false,
				},
				sessionId: {
					type: DataTypes.STRING,
					allowNull: false,
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
				tableName: 'games_transactions',
				timestamps: true,
			},
		);
		return GamesTransactions;
	}

	static associate() {
		GamesTransactions.belongsTo(Players, { foreignKey: 'playerId' });
		GamesTransactions.belongsTo(Currencies, { foreignKey: 'currencyId' });
		GamesTransactions.belongsTo(Rounds, { foreignKey: 'roundId' });
	}
}
