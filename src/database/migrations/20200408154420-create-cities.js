/* eslint-disable linebreak-style */
module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable(
      'cities',
      {
        id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
        },
        name: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        state: {
          type: Sequelize.STRING,
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
        created_at: {
          type: Sequelize.DATE,
          allowNull: false,
        },
        updated_at: {
          type: Sequelize.DATE,
          allowNull: false,
        },
      },
      {
        uniqueKeys: {
          actions_unique: {
            fields: ['name', 'state'],
          },
        },
      }
    ),

  down: queryInterface => queryInterface.dropTable('cities'),
};
