/* eslint-disable linebreak-style */
module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable('statuses', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      value: {
        type: Sequelize.INTEGER,
        allowNull: false,
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

  down: queryInterface => queryInterface.dropTable('statuses'),
};
