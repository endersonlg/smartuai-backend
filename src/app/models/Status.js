import Sequelize, { Model } from 'sequelize';

class Status extends Model {
  static init(sequelize) {
    super.init(
      {
        value: Sequelize.INTEGER,
      },
      {
        sequelize,
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.Device, { foreignKey: 'device_id', as: 'device' });
  }
}

export default Status;
