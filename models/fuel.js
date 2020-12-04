const sequelize = require('../config/database');
const { Model, DataTypes } = require('sequelize');

class Fuel extends Model {};

Fuel.init({
    ogc_fid: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: null,
        comment: null,
        primaryKey: true,
        field: "ogr_fid",
        autoIncrement: true
    },
    name: {
        type: DataTypes.CHAR(254),
        allowNull: true,
        defaultValue: null,
        comment: null,
        primaryKey: false,
        field: "name",
        autoIncrement: false
    },
    wkb_geometry: {
        type: DataTypes.GEOMETRY('POINT', 4326),
        allowNull: false,
        defaultValue: null,
        comment: null,
        primaryKey: false,
        field: "wkb_geometry",
        autoIncrement: false
    }
}, {
    sequelize,
    tableName: "fuel",
    comment: "",
    indexes: [{
        name: "fuel_wkb_geometry_geom_idx",
        unique: false,
        fields: ["wkb_geometry"]
    }],
    timestamps: false,
    modelName: 'fuel_model'
});

module.exports = Fuel;