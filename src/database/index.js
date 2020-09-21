import Sequelize from 'sequelize';
import databaseConfig from '../config/database';

import User from '../app/models/User';
import City from '../app/models/City';
import File from '../app/models/File';
import Device from '../app/models/Device';
import Suggestion from '../app/models/Suggestion';
import DamageReport from '../app/models/DamageReport';
import Status from '../app/models/Status';

const models = [User, City, File, Device, Suggestion, DamageReport, Status];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);

    models
      .map(model => model.init(this.connection))
      .map(model => model.associate && model.associate(this.connection.models));
  }
}

export default new Database();
