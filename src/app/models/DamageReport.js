import Sequelize, { Model } from 'sequelize';

class DamageReport extends Model {
  static init(sequelize) {
    super.init(
      {
        description: Sequelize.TEXT,
        damage_percentage: Sequelize.INTEGER,
        assumption: Sequelize.STRING,
        repair_date_time: Sequelize.DATE,
        situation: Sequelize.STRING,
      },
      {
        sequelize,
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
    this.belongsTo(models.User, { foreignKey: 'manager_id', as: 'manager' });
    this.belongsTo(models.Device, { foreignKey: 'device_id', as: 'device' });
  }
}

export default DamageReport;
