const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class Bars extends Model {}

Bars.init({
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
        modelName: 'BarsModel',
        tableName: "bars",
        comment: "",
        indexes: [{
            name: "bars_wkb_geometry_geom_idx",
            unique: false,
            fields: ["wkb_geometry"]
        }],
        timestamps: false
    }

);

module.exports = Bars;