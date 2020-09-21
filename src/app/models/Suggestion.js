import Sequelize, { Model } from 'sequelize';

class Suggestion extends Model {
  static init(sequelize) {
    super.init(
      {
        district: Sequelize.STRING,
        street: Sequelize.STRING,
        number: Sequelize.INTEGER,
        latitude: Sequelize.FLOAT,
        longitude: Sequelize.FLOAT,
        description: Sequelize.TEXT,
        solicitation: Sequelize.STRING,
        reason: Sequelize.STRING,
        reply_date_time: Sequelize.DATE,
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
    this.belongsTo(models.City, { foreignKey: 'city_id', as: 'city' });
  }
}

export default Suggestion;
