import Sequelize, { Model } from 'sequelize';
import bcrypt from 'bcryptjs';

class User extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        password: Sequelize.VIRTUAL,
        password_hash: Sequelize.STRING,
        cellphone: Sequelize.STRING,
        cpf: Sequelize.STRING,
        manager: Sequelize.BOOLEAN,
        district: Sequelize.STRING,
        street: Sequelize.STRING,
        number: Sequelize.INTEGER,
        latitude: Sequelize.FLOAT,
        longitude: Sequelize.FLOAT,
        active: Sequelize.BOOLEAN,
      },
      {
        sequelize,
      }
    );

    this.addHook('beforeSave', async user => {
      if (user.password) {
        user.password_hash = await bcrypt.hash(user.password, 8);
      }
    });

    return this;
  }

  static associate(models) {
    this.belongsTo(models.File, { foreignKey: 'avatar_id', as: 'avatar' });
    this.belongsTo(models.City, { foreignKey: 'city_id', as: 'city' });
    this.hasMany(models.Suggestion, {
      foreignKey: 'user_id',
      as: 'suggestions',
    });
    this.hasMany(models.DamageReport, {
      foreignKey: 'user_id',
      as: 'damageReports',
    });
  }

  checkPassword(password) {
    return bcrypt.compare(password, this.password_hash);
  }
}

export default User;
