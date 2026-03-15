import { Model, DataTypes, Optional, Sequelize } from 'sequelize';

interface DbErrorAttributes {
	id: number;
	func?: string;
	args?: string;
}

type DbErrorCreationAttributes = Optional<DbErrorAttributes, 'id'>;

export default class DbErrors
	extends Model<DbErrorAttributes, DbErrorCreationAttributes>
	implements DbErrorAttributes
{
	public readonly id!: number;
	public func?: string;
	public args?: string;

	static initModel(sequelize: Sequelize): typeof DbErrors {
		DbErrors.init(
			{
				id: {
					type: DataTypes.BIGINT,
					allowNull: false,
					autoIncrement: true,
					primaryKey: true,
				},
				func: {
					type: DataTypes.STRING,
				},
				args: {
					type: DataTypes.TEXT,
				},
			},
			{
				sequelize,
				tableName: 'db_errors',
				timestamps: true,
			},
		);
		return DbErrors;
	}
}
