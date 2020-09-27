const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class Kiosk extends Model {};
Kiosk.init({
    ogr_fid: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: null,
        comment: null,
        primaryKey: true,
        field: "ogr_fid",
        autoIncrement: true
    },
    shop: {
        type: DataTypes.CHAR(254),
        allowNull: true,
        defaultValue: null,
        comment: null,
        primaryKey: false,
        field: "shop",
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
    modelName: 'kiosks_model',
    timestamps: false,
    tableName: "kiosks",
    comment: "",
    indexes: [{
        name: "kiosks_wkb_geometry_geom_idx",
        unique: false,
        fields: ["wkb_geometry"]
    }]
})
module.exports = Kiosk;