module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable('devices', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      series: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      district: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      street: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      number: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      latitude: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      longitude: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      height: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      weight_supported: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      type: {
        type: Sequelize.STRING,
        allowNull: false,
        values: ['Orgânico', 'Inorgânico'],
      },
      time_collect: {
        type: Sequelize.TIME,
        allowNull: false,
        defaultValue: '00:00:00',
      },
      time_average: {
        type: Sequelize.TIME,
        allowNull: false,
        defaultValue: '00:00:00',
      },
      active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      manager_id: {
        type: Sequelize.INTEGER,
        references: { model: 'users', key: 'id' },
        OnUpdate: 'CASCADE',
        allowNull: false,
      },
      city_id: {
        type: Sequelize.INTEGER,
        references: { model: 'cities', key: 'id' },
        onUpdate: 'CASCADE',
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    }),

  down: queryInterface => queryInterface.dropTable('devices'),
};
