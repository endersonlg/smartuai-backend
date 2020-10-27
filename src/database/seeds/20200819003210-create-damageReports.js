const faker = require('faker');

/* eslint linebreak-style: ["error", "unix"] */

function generateDamageReports() {
  const damageReports = [];

  for (let id = 1; id <= 5; id += 1) {
    const description = faker.random.words();
    const damage_percentage = faker.random.number(100);
    const assumption = faker.random.boolean()
      ? 'Vandalismo'
      : 'Causas Naturais';
    const user_id = faker.random.number({ min: 1, max: 20 });
    const device_id = faker.random.number({ min: 1, max: 20 });
    const created_at = faker.date.past();
    const updated_at = faker.date.past();

    const numberAux = faker.random.number(2);

    let situation;
    let repair_date_time;
    let manager_id;

    if (numberAux === 0) {
      situation = 'Aberto';
      repair_date_time = null;
      manager_id = null;
    } else if (numberAux === 1) {
      situation = 'Progresso';
      repair_date_time = faker.date.future();
      manager_id = 1;
    } else {
      situation = 'Concluído';
      repair_date_time = faker.date.past();
      manager_id = 1;
    }

    damageReports.push({
      assumption,
      damage_percentage,
      description,
      user_id,
      device_id,
      situation,
      repair_date_time,
      manager_id,
      created_at,
      updated_at,
    });
  }

  return damageReports;
}

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('damage_reports', generateDamageReports());
  },

  down: (queryInterface, Sequelize) => {},
};
