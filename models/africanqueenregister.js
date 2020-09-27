const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database')

class AQ extends Model {};

AQ.init({

    ogr_fid: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: null,
        comment: null,
        primaryKey: true,
        field: "ogr_fid",
        autoIncrement: true
    },
    customer_n: {
        type: DataTypes.CHAR(254),
        allowNull: true,
        defaultValue: null,
        comment: null,
        primaryKey: false,
        field: "customer_n",
        autoIncrement: false
    },
    customer_t: {
        type: DataTypes.CHAR(254),
        allowNull: true,
        defaultValue: null,
        comment: null,
        primaryKey: false,
        field: "customer_t",
        autoIncrement: false
    },
    address_1: {
        type: DataTypes.CHAR(254),
        allowNull: true,
        defaultValue: null,
        comment: null,
        primaryKey: false,
        field: "address_1",
        autoIncrement: false
    },
    address_2: {
        type: DataTypes.CHAR(254),
        allowNull: true,
        defaultValue: null,
        comment: null,
        primaryKey: false,
        field: "address_2",
        autoIncrement: false
    },
    latitude: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: null,
        comment: null,
        primaryKey: false,
        field: "latitude",
        autoIncrement: false
    },
    longitude: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: null,
        comment: null,
        primaryKey: false,
        field: "longitude",
        autoIncrement: false
    },
    customer_1: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: null,
        comment: null,
        primaryKey: false,
        field: "customer_1",
        autoIncrement: false
    },
    created_da: {
        type: DataTypes.CHAR(254),
        allowNull: true,
        defaultValue: null,
        comment: null,
        primaryKey: false,
        field: "created_da",
        autoIncrement: false
    },
    gt_country: {
        type: DataTypes.CHAR(254),
        allowNull: true,
        defaultValue: null,
        comment: null,
        primaryKey: false,
        field: "gt_country",
        autoIncrement: false
    },
    bt_territo: {
        type: DataTypes.CHAR(254),
        allowNull: true,
        defaultValue: null,
        comment: null,
        primaryKey: false,
        field: "bt_territo",
        autoIncrement: false
    },
    bt_area: {
        type: DataTypes.CHAR(254),
        allowNull: true,
        defaultValue: null,
        comment: null,
        primaryKey: false,
        field: "bt_area",
        autoIncrement: false
    },
    bt_town: {
        type: DataTypes.CHAR(254),
        allowNull: true,
        defaultValue: null,
        comment: null,
        primaryKey: false,
        field: "bt_town",
        autoIncrement: false
    },
    cs_chanel: {
        type: DataTypes.CHAR(254),
        allowNull: true,
        defaultValue: null,
        comment: null,
        primaryKey: false,
        field: "cs_chanel",
        autoIncrement: false
    },
    cs_type_of: {
        type: DataTypes.CHAR(254),
        allowNull: true,
        defaultValue: null,
        comment: null,
        primaryKey: false,
        field: "cs_type_of",
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
    modelName: 'africanqueenregister_model',
    tableName: "africanqueenregister",
    comment: "",
    indexes: [{
        name: "africanqueenregister_wkb_geometry_geom_idx",
        unique: false,
        fields: ["wkb_geometry"]
    }]
});
module.exports = AQ;