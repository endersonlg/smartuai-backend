const faker = require('faker');

/* eslint linebreak-style: ["error", "unix"] */

function generateUsers() {
  const users = [];

  for (let id = 1; id <= 25; id += 1) {
    const name = faker.name.findName();
    const email = faker.internet.email();
    const password_hash = faker.internet.password();
    const cellphone = faker.phone.phoneNumber();
    const cpf = faker.phone.phoneNumber();
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
    const active = faker.random.boolean();
    const city_id = 1;
    const created_at = faker.date.past();
    const updated_at = faker.date.past();

    users.push({
      name,
      email,
      password_hash,
      cellphone,
      cpf,
      district,
      street,
      number,
      latitude,
      longitude,
      active,
      city_id,
      created_at,
      updated_at,
    });
  }

  return users;
}

module.exports = {
  up: queryInterface => {
    return queryInterface.bulkInsert('users', generateUsers());
  },
  down: queryInterface => {
    return queryInterface.bulkDelete('Users', null, {});
  },
};
