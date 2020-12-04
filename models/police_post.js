const sequelize = require('../config/database');
const { Model, DataTypes } = require('sequelize');

class Police extends Model {};
Police.init({
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
    modelName: 'police_post_model',
    tableName: "police_post",
    comment: "",
    indexes: [{
        name: "police_post_wkb_geometry_geom_idx",
        unique: false,
        fields: ["wkb_geometry"]
    }]
})
module.exports = Police;