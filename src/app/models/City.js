import Sequelize, { Model } from 'sequelize';

class City extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        state: Sequelize.STRING,
        latitude: Sequelize.FLOAT,
        longitude: Sequelize.FLOAT,
      },
      {
        sequelize,
      }
    );
    return this;
  }

  static associate(models) {
    this.hasMany(models.User, { foreignKey: 'city_id', as: 'users' });
    this.hasMany(models.Device, { foreignKey: 'city_id', as: 'devices' });
  }
}
export default City;
