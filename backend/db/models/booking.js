'use strict';
const {
  Model
} = require('sequelize');
const { Sequelize } = require('.');
module.exports = (sequelize, DataTypes) => {
  class Booking extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Booking.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'User',
          key: 'id'
        }
      },
      spotId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Spot',
          key: 'id'
        }
      },
      startDate: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
          isFuture (value) {
            if (value < Sequelize.literal('CURRENT TIMESTAMP')) {
              throw new Error("startDate cannot be in the past")
            }
          }
        }
      },
      endDate: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
          isFuture (value) {
            if (value <= this.startDate) {
              throw new Error("endDate cannot be on or before startDate")
            }
          }
        }
      }
    },
    {sequelize,
    modelName: 'Booking',
  });
  return Booking;
};