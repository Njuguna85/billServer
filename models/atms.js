const sequelize = require('../config/database');
const { DataTypes, Model } = require('sequelize');

class Atm extends Model {};


Atm.init({
    ogr_fid: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: null,
        comment: null,
        primaryKey: true,
        field: "ogr_fid",
        autoIncrement: true
    },
    full_id: {
        type: DataTypes.CHAR(254),
        allowNull: true,
        defaultValue: null,
        comment: null,
        primaryKey: false,
        field: "full_id",
        autoIncrement: false
    },
    amenity: {
        type: DataTypes.CHAR(254),
        allowNull: true,
        defaultValue: null,
        comment: null,
        primaryKey: false,
        field: "amenity",
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
    operator: {
        type: DataTypes.CHAR(254),
        allowNull: true,
        defaultValue: null,
        comment: null,
        primaryKey: false,
        field: "operator",
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
    tableName: "atms",
    comment: "",
    indexes: [{
        name: "atms_wkb_geometry_geom_idx",
        unique: false,
        fields: ["wkb_geometry"]
    }],
    modelName: 'atms_model'
})

module.exports = Atm;