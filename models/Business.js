const sequelize = require('../config/database');
const { DataTypes, Model } = require('sequelize');


class Business extends Model {};

Business.init({
    business: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        field: "id",
        autoIncrement: true
    },
    business_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    user: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    name: {
        type: DataTypes.CHAR(254),
        allowNull: false,
    },
    longitude: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: null,
    },
    latitude: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: null,
    },

}, {
    sequelize,
    modelName: 'business',
    timestamps: true,
    tableName: "business",
})

module.exports = Business;