'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Spot extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Spot.hasMany(models.Booking, { foreignKey: "spotId" });
      Spot.hasMany(models.Review, { foreignKey: "spotId" });
      Spot.hasMany(models.SpotImage, { foreignKey: "spotId" });
    }
  }
  Spot.init({
    ownerId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false
    },
    country: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lat: {
      type: DataTypes.DECIMAL,
      validate: {
        max: 90,
        min: -90
      }
    },
    Ing: {
      type: DataTypes.DECIMAL,
      validate: {
        max: 180,
        min: -180
      }
    },
    name: {
      type: DataTypes.STRING,
      validate: {
        len: [0, 49]
      }
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false
    },
    price: {
      type: DataTypes.DECIMAL,
      validate: {
        min: 1
      }
    }
  }, {
    sequelize,
    modelName: 'Spot',
  });
  return Spot;
};