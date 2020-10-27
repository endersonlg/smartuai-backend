const faker = require('faker');

/* eslint linebreak-style: ["error", "unix"] */

function generateStatus() {
  const status = [];

  for (let id = 5; id <= 12; id += 1) {
    const value = faker.random.number({ min: 1, max: 100 });
    const device_id = id;
    const created_at = faker.date.past();
    const updated_at = faker.date.past();

    status.push({
      value,
      device_id,
      created_at,
      updated_at,
    });
  }

  return status;
}

module.exports = {
  up: queryInterface => {
    return queryInterface.bulkInsert('statuses', generateStatus());
  },

  down: queryInterface => {},
};
