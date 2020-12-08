const { DataTypes, Model } = require('sequelize')
const sequelize = require('../config/database')

class Poi extends Model { };

Poi.init({

    ogc_fid: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: null,
        comment: null,
        primaryKey: true,
        field: "ogc_fid",
        autoIncrement: true
    },
    osm_id: {
        type: DataTypes.CHAR(254),
        allowNull: false,
        defaultValue: null,
        comment: null,
        primaryKey: true,
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
    type: {
        type: DataTypes.CHAR(254),
        allowNull: true,
        defaultValue: null,
        comment: null,
        primaryKey: false,
        field: "type",
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
    tableName: "pois",
    comment: "",
    indexes: [{
        name: "pois_wkb_geometry_geom_idx",
        unique: false,
        fields: ["wkb_geometry"]
    }],
    modelName: 'pois_model'
});

module.exports = Poi;