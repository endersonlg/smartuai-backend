module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable('damage_reports', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      damage_percentage: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      assumption: {
        type: Sequelize.STRING,
        allowNull: false,
        values: ['Causas Naturais', 'Vandalismo'],
      },
      repair_date_time: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      situation: {
        type: Sequelize.STRING,
        allowNull: false,
        values: ['Aberto', 'Progresso', 'Concluído'],
        defaultValue: 'Aberto',
      },
      user_id: {
        type: Sequelize.INTEGER,
        references: { model: 'users', key: 'id' },
        OnUpdate: 'CASCADE',
        allowNull: false,
      },
      manager_id: {
        type: Sequelize.INTEGER,
        references: { model: 'users', key: 'id' },
        OnUpdate: 'CASCADE',
        allowNull: true,
      },
      device_id: {
        type: Sequelize.INTEGER,
        references: { model: 'devices', key: 'id' },
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

  down: queryInterface => queryInterface.dropTable('damage_reports'),
};
