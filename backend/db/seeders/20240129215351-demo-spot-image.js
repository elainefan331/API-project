'use strict';

const { SpotImage } = require("../models");

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
    await SpotImage.bulkCreate([
      {
        spotId: 1,
        url: 'https://live.staticflickr.com/65535/53539478973_02a1d70e34_k.jpg',
        preview: true
      },
      {
        spotId: 1,
        url: 'https://live.staticflickr.com/65535/53539626294_a321ef67be_k.jpg',
        preview: false
      },
      {
        spotId: 1,
        url: 'https://live.staticflickr.com/65535/53539723485_2685405f76_k.jpg',
        preview: false
      },
      {
        spotId: 1,
        url: 'https://live.staticflickr.com/65535/53539723410_448d1cc8c5_k.jpg',
        preview: false
      },
      {
        spotId: 1,
        url: 'https://live.staticflickr.com/65535/53539626289_d906cb79e6_k.jpg',
        preview: false
      },
      {
        spotId: 2,
        url: 'https://live.staticflickr.com/65535/53544429637_94f3f00da7_k.jpg',
        preview: true
      },
      {
        spotId: 2,
        url: 'https://live.staticflickr.com/65535/53544429672_e20025c470_k.jpg',
        preview: false
      },
      {
        spotId: 2,
        url: 'https://live.staticflickr.com/65535/53544429307_c770ac5fb2_k.jpg',
        preview: false
      },
      {
        spotId: 2,
        url: 'https://live.staticflickr.com/65535/53545624969_30e57631f4_k.jpg',
        preview: false
      },
      {
        spotId: 2,
        url: 'https://live.staticflickr.com/65535/53539626289_d906cb79e6_k.jpg',
        preview: false
      },
      {
        spotId: 3,
        url: 'https://live.staticflickr.com/65535/53544429512_7139bc061e_k.jpg',
        preview: true
      },
      {
        spotId: 3,
        url: 'https://live.staticflickr.com/65535/53544429417_db63e0c41e_k.jpg',
        preview: false
      },
      {
        spotId: 3,
        url: 'https://live.staticflickr.com/65535/53544429562_bc5b9bb40c_k.jpg',
        preview: false
      },
      {
        spotId: 3,
        url: 'https://live.staticflickr.com/65535/53545739005_9fd1170b1f_k.jpg',
        preview: false
      },
      {
        spotId: 3,
        url: 'https://live.staticflickr.com/65535/53545299511_5a39bcce6c_k.jpg',
        preview: false
      },
      {
        spotId: 4,
        url: 'https://live.staticflickr.com/65535/53545738665_8bc982a58a_k.jpg',
        preview: true
      },
      {
        spotId: 4,
        url: 'https://live.staticflickr.com/65535/53544429302_7b87a6e96a_k.jpg',
        preview: false
      },
      {
        spotId: 4,
        url: 'https://live.staticflickr.com/65535/53545299246_35d69b8bec_k.jpg',
        preview: false
      },
      {
        spotId: 4,
        url: 'https://live.staticflickr.com/65535/53545625269_391b2084ae_k.jpg',
        preview: false
      },
      {
        spotId: 4,
        url: 'https://live.staticflickr.com/65535/53545488453_eb7ee533eb_k.jpg',
        preview: false
      },
      {
        spotId: 5,
        url: 'https://live.staticflickr.com/65535/53545738645_172591aff4_k.jpg',
        preview: true
      },
      {
        spotId: 5,
        url: 'https://live.staticflickr.com/65535/53545299401_542946aa6c_k.jpg',
        preview: false
      },
      {
        spotId: 5,
        url: 'https://live.staticflickr.com/65535/53545488453_eb7ee533eb_k.jpg',
        preview: false
      },
      {
        spotId: 5,
        url: 'https://live.staticflickr.com/65535/53544429562_bc5b9bb40c_k.jpg',
        preview: false
      },
      {
        spotId: 5,
        url: 'https://live.staticflickr.com/65535/53539300986_a60436ca1f_k.jpg',
        preview: false
      },
      {
        spotId: 6,
        url: 'https://live.staticflickr.com/65535/53545299401_542946aa6c_k.jpg',
        preview: true
      },
      {
        spotId: 6,
        url: 'https://live.staticflickr.com/65535/53544429672_e20025c470_k.jpg',
        preview: false
      },
      {
        spotId: 6,
        url: 'https://live.staticflickr.com/65535/53544429307_c770ac5fb2_k.jpg',
        preview: false
      },
      {
        spotId: 6,
        url: 'https://live.staticflickr.com/65535/53545488453_eb7ee533eb_k.jpg',
        preview: false
      },
      {
        spotId: 6,
        url: 'https://live.staticflickr.com/65535/53545739005_9fd1170b1f_k.jpg',
        preview: false
      },
      {
        spotId: 7,
        url: 'https://live.staticflickr.com/65535/53545663572_ca14a028ec_k.jpg',
        preview: true
      },
      {
        spotId: 7,
        url: 'https://live.staticflickr.com/65535/53546864814_5a5a7a8f65_k.jpg',
        preview: false
      },
      {
        spotId: 7,
        url: 'https://live.staticflickr.com/65535/53546723578_48c4cd320e_k.jpg',
        preview: false
      },
      {
        spotId: 7,
        url: 'https://live.staticflickr.com/65535/53546970840_d641ff5bfe_k.jpg',
        preview: false
      },
      {
        spotId: 7,
        url: 'https://live.staticflickr.com/65535/53539723410_448d1cc8c5_k.jpg',
        preview: false
      },
      {
        spotId: 8,
        url: 'https://live.staticflickr.com/65535/53545661727_0d45249070_k.jpg',
        preview: true
      },
      {
        spotId: 8,
        url: 'https://live.staticflickr.com/65535/53546530341_840dc423b4_k.jpg',
        preview: false
      },
      {
        spotId: 8,
        url: 'https://live.staticflickr.com/65535/53546530321_6328b950bc_k.jpg',
        preview: false
      },
      {
        spotId: 8,
        url: 'https://live.staticflickr.com/65535/53546970840_d641ff5bfe_k.jpg',
        preview: false
      },
      {
        spotId: 8,
        url: 'https://live.staticflickr.com/65535/53546862934_5d4cfebe49_k.jpg',
        preview: false
      },
      {
        spotId: 9,
        url: 'https://live.staticflickr.com/65535/53545662122_13eae975fa_k.jpg',
        preview: true
      },
      {
        spotId: 9,
        url: 'https://live.staticflickr.com/65535/53546971160_aaf68116d7_k.jpg',
        preview: false
      },
      {
        spotId: 9,
        url: 'https://live.staticflickr.com/65535/53546530706_1f9793a416_k.jpg',
        preview: false
      },
      {
        spotId: 9,
        url: 'https://live.staticflickr.com/65535/53546721918_27fd092d18_k.jpg',
        preview: false
      },
      {
        spotId: 9,
        url: 'https://live.staticflickr.com/65535/53546721893_14f0c3c7a0_k.jpg',
        preview: false
      },
      {
        spotId: 10,
        url: 'https://live.staticflickr.com/65535/53545663207_83c84165ad_k.jpg',
        preview: true
      },
      {
        spotId: 10,
        url: 'https://live.staticflickr.com/65535/53546972410_c66abaa051_k.jpg',
        preview: false
      },
      {
        spotId: 10,
        url: 'https://live.staticflickr.com/65535/53546723158_5af93f6ac5_k.jpg',
        preview: false
      },
      {
        spotId: 10,
        url: 'https://live.staticflickr.com/65535/53546723133_dff5ec80ae_k.jpg',
        preview: false
      },
      {
        spotId: 10,
        url: 'https://live.staticflickr.com/65535/53546972385_0ae08e97c8_k.jpg',
        preview: false
      },
      {
        spotId: 11,
        url: 'https://live.staticflickr.com/65535/53546722793_1a851b398c_k.jpg',
        preview: true
      },
      {
        spotId: 11,
        url: 'https://live.staticflickr.com/65535/53546722748_31ea38b76f_k.jpg',
        preview: false
      },
      {
        spotId: 11,
        url: 'https://live.staticflickr.com/65535/53546722778_2c31a163c2_k.jpg',
        preview: false
      },
      {
        spotId: 11,
        url: 'https://live.staticflickr.com/65535/53546972030_35181e0ff8_k.jpg',
        preview: false
      },
      {
        spotId: 11,
        url: 'https://live.staticflickr.com/65535/53546531406_a944be68a5_k.jpg',
        preview: false
      },
      {
        spotId: 12,
        url: 'https://live.staticflickr.com/65535/53546863729_25563dad3e_k.jpg',
        preview: true
      },
      {
        spotId: 12,
        url: 'https://live.staticflickr.com/65535/53546722333_eb63b557a9_k.jpg',
        preview: false
      },
      {
        spotId: 12,
        url: 'https://live.staticflickr.com/65535/53545662527_48827f7280_k.jpg',
        preview: false
      },
      {
        spotId: 12,
        url: 'https://live.staticflickr.com/65535/53546531091_5db350865b_k.jpg',
        preview: false
      },
      {
        spotId: 12,
        url: 'https://live.staticflickr.com/65535/53546863724_1cc4db9585_k.jpg',
        preview: false
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
    options.tableName = 'SpotImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      spotId: { [Op.in]: [1, 2, 3] }
    }, {});
  }
};
