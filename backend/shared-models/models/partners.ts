import { Model, DataTypes, Optional, Sequelize } from 'sequelize';
import Games from './games';
import PartnerGame from './parnerGame';

interface PartnerAttributes {
	id: number;
	name: string;
	login: string;
	password: string;
}

type PartnerCreationAttributes = Optional<PartnerAttributes, 'id'>;

export default class Partners extends Model<PartnerAttributes, PartnerCreationAttributes> implements PartnerAttributes {
	public readonly id!: number;
	public name!: string;
	public login!: string;
	public password!: string;
	public readonly Games?: Games[];

	static initModel(sequelize: Sequelize): typeof Partners {
		Partners.init(
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
					unique: true,
				},
				login: {
					type: DataTypes.STRING,
					allowNull: false,
					unique: true,
				},
				password: {
					type: DataTypes.STRING,
					allowNull: false,
				},
			},
			{
				sequelize,
				tableName: 'partners',
				timestamps: false,
			}
		);
		return Partners;
	}

	static associate() {}
}
