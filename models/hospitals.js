const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class Hospital extends Model {};

Hospital.init({
    ogc_fid: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: null,
        comment: null,
        primaryKey: true,
        field: "ogr_fid",
        autoIncrement: true
    },
    osm_id: {
        type: DataTypes.CHAR(254),
        allowNull: true,
        defaultValue: null,
        comment: null,
        primaryKey: false,
        field: "osm_id",
        autoIncrement: false
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
    timestamps: false,
    modelName: 'hospitals_model',
    tableName: "hospitals",
    comment: "",
    indexes: [{
        name: "hospitals_wkb_geometry_geom_idx",
        unique: false,
        fields: ["wkb_geometry"]
    }]
});

module.exports = Hospital;