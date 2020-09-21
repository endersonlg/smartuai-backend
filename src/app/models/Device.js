import Sequelize, { Model } from 'sequelize';

class Device extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        series: Sequelize.INTEGER,
        district: Sequelize.STRING,
        street: Sequelize.STRING,
        number: Sequelize.INTEGER,
        latitude: Sequelize.FLOAT,
        longitude: Sequelize.FLOAT,
        height: Sequelize.INTEGER,
        weight_supported: Sequelize.FLOAT,
        type: Sequelize.STRING,
        time_collect: Sequelize.TIME,
        time_average: Sequelize.TIME,
        active: Sequelize.BOOLEAN,
      },
      {
        sequelize,
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: 'manager_id', as: 'manager' });
    this.belongsTo(models.City, { foreignKey: 'city_id', as: 'city' });
    this.hasMany(models.DamageReport, {
      foreignKey: 'device_id',
      as: 'damageReports',
    });
    this.hasMany(models.Status, {
      foreignKey: 'device_id',
      as: 'status',
    });
  }
}

export default Device;
