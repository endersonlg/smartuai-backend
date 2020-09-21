const faker = require('faker');

/* eslint linebreak-style: ["error", "unix"] */

function generateDevices() {
  const devices = [];

  for (let id = 1; id <= 20; id += 1) {
    const name = faker.name.findName();
    const series = faker.random.number();
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
    const height = faker.random.number();
    const weight_supported = faker.random.number();
    const type = faker.random.boolean() ? 'Orgânico' : 'Inorgânico';
    const time_collect = faker.date.past();
    const time_average = faker.date.past();
    const active = faker.random.boolean();
    const manager_id = 1;
    const city_id = 1;
    const created_at = faker.date.past();
    const updated_at = faker.date.past();

    devices.push({
      name,
      series,
      district,
      street,
      number,
      latitude,
      longitude,
      height,
      weight_supported,
      type,
      time_collect,
      time_average,
      active,
      manager_id,
      city_id,
      created_at,
      updated_at,
    });
  }

  return devices;
}

module.exports = {
  up: queryInterface => {
    return queryInterface.bulkInsert('devices', generateDevices());
  },

  down: queryInterface => {},
};
