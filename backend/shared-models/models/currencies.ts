import { Model, DataTypes, Optional, Sequelize } from 'sequelize';

interface CurrencyAttributes {
	id: string;
	name: string;
	sign: string;
	rate?: number;
	updatedAt?: Date;
}

type CurrencyCreationAttributes = Optional<CurrencyAttributes, 'sign'>;

export default class Currencies
	extends Model<CurrencyAttributes, CurrencyCreationAttributes>
	implements CurrencyAttributes
{
	public id!: string;
	public name!: string;
	public sign!: string;
	public rate?: number;
	public updatedAt?: Date;

	static initModel(sequelize: Sequelize): typeof Currencies {
		Currencies.init(
			{
				id: {
					type: DataTypes.STRING(8),
					primaryKey: true,
					allowNull: false,
				},
				name: {
					type: DataTypes.STRING(64),
					allowNull: false,
					unique: true,
				},
				sign: {
					type: DataTypes.STRING(16),
					allowNull: false,
				},
				rate: {
					type: DataTypes.DECIMAL(32, 20),
				},
				updatedAt: {
					type: DataTypes.DATE,
					allowNull: false,
					defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
				},
			},
			{
				sequelize,
				tableName: 'currencies',
				timestamps: true,
				createdAt: false,
				updatedAt: true,
			},
		);
		return Currencies;
	}
}
