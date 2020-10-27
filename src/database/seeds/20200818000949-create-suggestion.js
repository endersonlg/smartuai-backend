const faker = require('faker');

/* eslint linebreak-style: ["error", "unix"] */

function generateSuggestions() {
  const suggestions = [];

  for (let id = 1; id <= 6; id += 1) {
    const district = faker.address.streetName();
    const street = faker.address.streetName();
    const number = faker.random.number();
    const latitude = faker.random.number({
      min: -22.240671,
      max: -22.214058,
      precision: 0.001,
    });
    const longitude = faker.random.number({
      min: -45.954911,
      max: -45.905407,
      precision: 0.001,
    });
    const description = faker.random.words();
    const user_id = faker.random.number({ min: 1, max: 20 });
    const city_id = 1;
    const created_at = faker.date.past();
    const updated_at = faker.date.past();

    const numberAux = faker.random.number(2);

    let solicitation;
    let reason;
    let reply_date_time;
    let manager_id;

    if (numberAux === 0) {
      solicitation = 'Em Análise';
      reason = null;
      reply_date_time = null;
      manager_id = null;
    } else if (numberAux === 1) {
      solicitation = 'Aprovado';
      reason = faker.random.words();
      reply_date_time = faker.date.recent();
      manager_id = 1;
    } else {
      solicitation = 'Reprovado';
      reason = faker.random.words();
      reply_date_time = null;
      manager_id = 1;
    }

    suggestions.push({
      district,
      street,
      number,
      latitude,
      longitude,
      description,
      user_id,
      city_id,
      solicitation,
      reason,
      reply_date_time,
      manager_id,
      created_at,
      updated_at,
    });
  }

  return suggestions;
}

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('suggestions', generateSuggestions());
  },

  down: (queryInterface, Sequelize) => {},
};
