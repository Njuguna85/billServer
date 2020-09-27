const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class Ghana extends Model {};

Ghana.init({
    ogr_fid: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: null,
        comment: null,
        primaryKey: true,
        field: "ogr_fid",
        autoIncrement: true
    },
    adm2_name: {
        type: DataTypes.CHAR(50),
        allowNull: true,
        defaultValue: null,
        comment: null,
        primaryKey: false,
        field: "adm2_name",
        autoIncrement: false
    },
    hrname: {
        type: DataTypes.CHAR(50),
        allowNull: true,
        defaultValue: null,
        comment: null,
        primaryKey: false,
        field: "hrname",
        autoIncrement: false
    },
    totpop_cy: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: null,
        comment: null,
        primaryKey: false,
        field: "totpop_cy",
        autoIncrement: false
    },
    mrstsingle: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: null,
        comment: null,
        primaryKey: false,
        field: "mrstsingle",
        autoIncrement: false
    },
    mrstmarrie: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: null,
        comment: null,
        primaryKey: false,
        field: "mrstmarrie",
        autoIncrement: false
    },
    mrstdiv: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: null,
        comment: null,
        primaryKey: false,
        field: "mrstdiv",
        autoIncrement: false
    },
    purchppc: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: null,
        comment: null,
        primaryKey: false,
        field: "purchppc",
        autoIncrement: false
    },
    males_cy: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: null,
        comment: null,
        primaryKey: false,
        field: "males_cy",
        autoIncrement: false
    },
    females_cy: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: null,
        comment: null,
        primaryKey: false,
        field: "females_cy",
        autoIncrement: false
    },
    tothh_cy: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: null,
        comment: null,
        primaryKey: false,
        field: "tothh_cy",
        autoIncrement: false
    },
    ttfoodbeva: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: null,
        comment: null,
        primaryKey: false,
        field: "ttfoodbeva",
        autoIncrement: false
    },
    alcoholbev: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: null,
        comment: null,
        primaryKey: false,
        field: "alcoholbev",
        autoIncrement: false
    },
    tobacco: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: null,
        comment: null,
        primaryKey: false,
        field: "tobacco",
        autoIncrement: false
    },
    clothing: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: null,
        comment: null,
        primaryKey: false,
        field: "clothing",
        autoIncrement: false
    },
    electronis: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: null,
        comment: null,
        primaryKey: false,
        field: "electronis",
        autoIncrement: false
    },
    toysportsg: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: null,
        comment: null,
        primaryKey: false,
        field: "toysportsg",
        autoIncrement: false
    },
    wkb_geometry: {
        type: DataTypes.GEOMETRY('POLYGON', 4326),
        allowNull: false,
        defaultValue: null,
        comment: null,
        primaryKey: false,
        field: "wkb_geometry",
        autoIncrement: false
    }
}, {
    sequelize,
    modelName: 'ghanapopulation_model',
    timestamps: false,
    tableName: "ghanapopulation",
    comment: "",
    indexes: [{
        name: "ghanapopulation_wkb_geometry_geom_idx",
        unique: false,
        fields: ["wkb_geometry"]
    }]
});

module.exports = Ghana;