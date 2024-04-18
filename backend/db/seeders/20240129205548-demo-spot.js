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
        description: 'Charming two-bedroom cottage. great for star gazing and wildlife spotting.',
        price: 123,
      },
      {
        ownerId: 1,
        address: '456 Oak Street',
        city: 'Newton',
        state: 'MA',
        country: 'USA',
        lat: 39.7989,
        lng: -89.6543,
        name: 'Cozy mountain cottage',
        description: 'Cozy mountain cottage with breathtaking landscape views.',
        price: 123.45,
      },
      {
        ownerId: 1,
        address: '789 Pine Street',
        city: 'Bend',
        state: 'OR',
        country: 'USA',
        lat: 39.7910,
        lng: -89.6441,
        name: 'Forest Lane Campground',
        description: 'Family-friendly campsite, perfect for swimming, fishing, and boating.',
        price: 123.56,
      },
      {
        ownerId: 2,
        address: '123 Langley st',
        city: 'New York',
        state: 'NY',
        country: 'USA',
        lat: 39.7910,
        lng: 39.6441,
        name: 'Wood Campground',
        description: 'Family-friendly campsite, perfect for swimming, fishing, and boating.',
        price: 146.07,
      },
      {
        ownerId: 2,
        address: '787 Happy st',
        city: 'Woodstock',
        state: 'NH',
        country: 'USA',
        lat: 37.7910,
        lng: 37.6441,
        name: 'NH camp',
        description: 'Cozy camp site with breathtaking landscape views.',
        price: 132,
      },
      {
        ownerId: 2,
        address: '77 Hartford St',
        city: 'Highlands',
        state: 'NH',
        country: 'USA',
        lat: 0,
        lng: 0,
        name: 'Highlands House',
        description: 'Perfect for a couples getaway.',
        price: 145.84,
      },
      {
        ownerId: 3,
        address: '764 Lakeview Drive',
        city: 'Tahoe City',
        state: 'CA',
        country: 'USA',
        lat: 0,
        lng: 0,
        name: 'Lakeview Lodge',
        description: 'Waterfront cabin on Lake Tahoe with a private dock, ideal for water sports and relaxation.',
        price: 250,
      },
      {
        ownerId: 3,
        address: '365 Riverside Retreat',
        city: 'Savannah',
        state: 'GA',
        country: 'USA',
        lat: 37.7910,
        lng: 37.6441,
        name: 'Riverside Retreat Cabin',
        description: 'Serene waterfront cabin on the banks of a gentle river, perfect for fishing, and kayaking.',
        price: 220,
      },
      {
        ownerId: 3,
        address: '120 Boulder Creek',
        city: 'Boulder',
        state: 'CO',
        country: 'USA',
        lat: 0,
        lng: 0,
        name: 'Boulder Creek Cabin',
        description: 'Charming cabin by a babbling brook, surrounded by nature and wildlife, perfect for a tranquil getaway.',
        price: 190.45,
      },
      {
        ownerId: 1,
        address: '88 Boulder Pass',
        city: 'Estes Park',
        state: 'CO',
        country: 'USA',
        lat: 37.7910,
        lng: 37.6441,
        name: 'Boulder Pass Camp',
        description: 'campsite surrounded by dense pine trees, ideal for hiking and nature walks.',
        price: 145.58,
      },
      {
        ownerId: 1,
        address: '411 Vanlife Vista',
        city: 'Portland',
        state: 'OR',
        country: 'USA',
        lat: 0,
        lng: 0,
        name: 'Vanlife Vista',
        description: 'Designed for campervans, this site offers full hookups and is a gateway to exploring urban and natural Oregon.',
        price: 234,
      },
      {
        ownerId: 1,
        address: '932 Modern Way',
        city: 'Asheville',
        state: 'NC',
        country: 'USA',
        lat: 37.7910,
        lng: 37.6441,
        name: 'Mod-Cabin',
        description: 'Sleek, modern cabin with floor-to-ceiling windows, offering stunning mountain views and contemporary comforts.',
        price: 300,
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
