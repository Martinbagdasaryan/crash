import { Model, DataTypes, Optional, Sequelize } from 'sequelize';

interface ErrorAttributes {
	id: number;
	message: string;
	code: number;
}

type ErrorCreationAttributes = Optional<ErrorAttributes, 'id'>;

export default class Errors
	extends Model<ErrorAttributes, ErrorCreationAttributes>
	implements ErrorAttributes
{
	public readonly id!: number;
	public message!: string;
	public code!: number;

	static initModel(sequelize: Sequelize): typeof Errors {
		Errors.init(
			{
				id: {
					type: DataTypes.BIGINT,
					allowNull: false,
					autoIncrement: true,
					primaryKey: true,
				},
				message: {
					type: DataTypes.STRING,
					allowNull: false,
				},
				code: {
					type: DataTypes.INTEGER,
					allowNull: false,
				},
			},
			{
				sequelize,
				tableName: 'errors',
				timestamps: true,
				createdAt: true,
				updatedAt: false,
			},
		);
		return Errors;
	}
}
