'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Booking extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Booking.belongsTo(models.User, { foreignKey: "userId" });
      Booking.belongsTo(models.Spot, { 
        foreignKey: "spotId",
        hooks: true,
        onDelete: 'SET NULL'
      });
    }
  }
  Booking.init({
    spotId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    startDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      validate: {
        isFuture(value) {
          let today = new Date();
          today.setHours(0, 0, 0);
          const startDate = new Date(value);

          if (startDate < today) {
            throw new Error("startDate cannot be in the past")
          }
        }
      }
    },
    endDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      validate: {
        isAfterStartDate(value) {
          const startDate = new Date(this.startDate);
          const endDate = new Date(value);

          if(endDate <= startDate) {
            throw new Error("endDate cannot be on or before startDate")
          }
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Booking',
  });
  return Booking;
};