import { Model, DataTypes, Optional, Sequelize } from 'sequelize';
import GamesTransactions from './gamesTransactions';
import Currencies from './currencies';

interface RefundAttributes {
  id: number;
  transactionId: number;
  amount: number;
  currencyId: string;
  createdAt: Date;
}

type RefundCreationAttributes = Optional<RefundAttributes, 'id'>;

export default class Refunds
  extends Model<RefundAttributes, RefundCreationAttributes>
  implements RefundAttributes {
  public readonly id!: number;
  public transactionId!: number;
  public amount!: number;
  public currencyId!: string;
  public createdAt!: Date;

  static initModel(sequelize: Sequelize): typeof Refunds {
    Refunds.init(
      {
        id: {
          type: DataTypes.BIGINT,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
        },
        transactionId: {
          type: DataTypes.BIGINT,
          allowNull: false,
        },
        amount: {
          type: DataTypes.DECIMAL(20, 2),
          allowNull: false,
        },
        currencyId: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        createdAt: {
          type: DataTypes.DATE,
          allowNull: false,
        },
      },
      {
        sequelize,
        tableName: 'refunds',
        timestamps: true,
      },
    );
    return Refunds;
  }

  static associate() {
    Refunds.belongsTo(GamesTransactions, { foreignKey: 'transactionId' });
    Refunds.belongsTo(Currencies, { foreignKey: 'currencyId' });
  }
}
