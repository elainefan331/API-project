'use strict';

const { Spot } = require("../models");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    await Spot.bulkCreate([
      {
        ownerId: 1,
        address: '123 Maple Street',
        city: 'Springfield',
        state: 'MA',
        country: 'USA',
        lat: 39.7817,
        lng: -89.6501,
        name: 'Maple House',
        description: 'Cozy one-bedroom house.',
        price: 120,
      },
      {
        ownerId: 2,
        address: '456 Oak Street',
        city: 'Newton',
        state: 'MA',
        country: 'USA',
        lat: 39.7989,
        lng: -89.6543,
        name: 'Oak House',
        description: 'Cozy two-bedroom house.',
        price: 150,
      },
      {
        ownerId: 3,
        address: '789 Pine Street',
        city: 'Brookline',
        state: 'MA',
        country: 'USA',
        lat: 39.7910,
        lng: -89.6441,
        name: 'Pine House',
        description: 'Cozy three-bedroom house.',
        price: 200,
      }

    ], { validate: true })
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = 'Spots';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      name: { [Op.in]: ['Maple House', 'Oak House', 'Pine House'] }
    }, {});
  }
};
