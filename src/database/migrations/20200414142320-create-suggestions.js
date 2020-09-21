module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable(
      'suggestions',
      {
        id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
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
        description: {
          type: Sequelize.TEXT,
          allowNull: false,
        },
        solicitation: {
          type: Sequelize.STRING,
          allowNull: false,
          values: ['Aprovado', 'Reprovado', 'Em Análise'],
          defaultValue: 'Em Análise',
        },
        reason: {
          type: Sequelize.TEXT,
          allowNull: true,
        },
        reply_date_time: {
          type: Sequelize.DATE,
          allowNull: true,
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
      },
      {
        uniqueKeys: {
          actions_unique: {
            fields: ['user_id', 'created_at'],
          },
        },
      }
    ),

  down: queryInterface => queryInterface.dropTable('suggestions'),
};
