const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');
const Joi = require('joi');

class Billboard extends Model {};

Billboard.init({
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: null,
        comment: null,
        primaryKey: true,
        field: "id",
        autoIncrement: true
    },
    billboardi: {
        type: DataTypes.CHAR(254),
        allowNull: true,
        defaultValue: null,
        comment: null,
        primaryKey: false,
        field: "billboardi",
        autoIncrement: false
    },
    routename: {
        type: DataTypes.CHAR(254),
        allowNull: true,
        defaultValue: null,
        comment: null,
        primaryKey: false,
        field: "routename",
        autoIncrement: false
    },
    scoutname: {
        type: DataTypes.CHAR(254),
        allowNull: true,
        defaultValue: null,
        comment: null,
        primaryKey: false,
        field: "scoutname",
        autoIncrement: false
    },
    date_: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        defaultValue: null,
        comment: null,
        primaryKey: false,
        field: "date_",
        autoIncrement: false
    },
    mediaowner: {
        type: DataTypes.CHAR(254),
        allowNull: true,
        defaultValue: null,
        comment: null,
        primaryKey: false,
        field: "mediaowner",
        autoIncrement: false
    },
    selectmedi: {
        type: DataTypes.CHAR(254),
        allowNull: true,
        defaultValue: null,
        comment: null,
        primaryKey: false,
        field: "selectmedi",
        autoIncrement: false
    },
    billboard_: {
        type: DataTypes.CHAR(254),
        allowNull: true,
        defaultValue: null,
        comment: null,
        primaryKey: false,
        field: "billboard_",
        autoIncrement: false
    },
    customerin: {
        type: DataTypes.CHAR(254),
        allowNull: true,
        defaultValue: null,
        comment: null,
        primaryKey: false,
        field: "customerin",
        autoIncrement: false
    },
    customerbr: {
        type: DataTypes.CHAR(254),
        allowNull: true,
        defaultValue: null,
        comment: null,
        primaryKey: false,
        field: "customerbr",
        autoIncrement: false
    },
    site_light: {
        type: DataTypes.CHAR(254),
        allowNull: true,
        defaultValue: null,
        comment: null,
        primaryKey: false,
        field: "site_light",
        autoIncrement: false
    },
    zone_: {
        type: DataTypes.CHAR(254),
        allowNull: true,
        defaultValue: null,
        comment: null,
        primaryKey: false,
        field: "zone_",
        autoIncrement: false
    },
    direction_: {
        type: DataTypes.CHAR(254),
        allowNull: true,
        defaultValue: null,
        comment: null,
        primaryKey: false,
        field: "direction_",
        autoIncrement: false
    },
    size_: {
        type: DataTypes.CHAR(254),
        allowNull: true,
        defaultValue: null,
        comment: null,
        primaryKey: false,
        field: "size_",
        autoIncrement: false
    },
    orientatio: {
        type: DataTypes.CHAR(254),
        allowNull: true,
        defaultValue: null,
        comment: null,
        primaryKey: false,
        field: "orientatio",
        autoIncrement: false
    },
    site_run_u: {
        type: DataTypes.CHAR(254),
        allowNull: true,
        defaultValue: null,
        comment: null,
        primaryKey: false,
        field: "site_run_u",
        autoIncrement: false
    },
    condition: {
        type: DataTypes.CHAR(254),
        allowNull: true,
        defaultValue: null,
        comment: null,
        primaryKey: false,
        field: "condition",
        autoIncrement: false
    },
    visibility: {
        type: DataTypes.CHAR(254),
        allowNull: true,
        defaultValue: null,
        comment: null,
        primaryKey: false,
        field: "visibility",
        autoIncrement: false
    },
    traffic: {
        type: DataTypes.CHAR(254),
        allowNull: true,
        defaultValue: null,
        comment: null,
        primaryKey: false,
        field: "traffic",
        autoIncrement: false
    },
    angle: {
        type: DataTypes.CHAR(254),
        allowNull: true,
        defaultValue: null,
        comment: null,
        primaryKey: false,
        field: "angle",
        autoIncrement: false
    },
    photo: {
        type: DataTypes.CHAR(254),
        allowNull: true,
        defaultValue: null,
        comment: null,
        primaryKey: false,
        field: "photo",
        autoIncrement: false
    },
    photo_long: {
        type: DataTypes.CHAR(254),
        allowNull: true,
        defaultValue: null,
        comment: null,
        primaryKey: false,
        field: "photo_long",
        autoIncrement: false
    },
    height: {
        type: DataTypes.CHAR(254),
        allowNull: true,
        defaultValue: null,
        comment: null,
        primaryKey: false,
        field: "height",
        autoIncrement: false
    },
    lat: {
        type: DataTypes.DOUBLE,
        allowNull: false,
        defaultValue: null,
        comment: null,
        primaryKey: false,
        field: "lat",
        autoIncrement: false
    },
    long_: {
        type: DataTypes.DOUBLE,
        allowNull: false,
        defaultValue: null,
        comment: null,
        primaryKey: false,
        field: "long_",
        autoIncrement: false
    },
    constituen: {
        type: DataTypes.CHAR(254),
        allowNull: true,
        defaultValue: null,
        comment: null,
        primaryKey: false,
        field: "constituen",
        autoIncrement: false
    },
    road_type: {
        type: DataTypes.CHAR(254),
        allowNull: true,
        defaultValue: null,
        comment: null,
        primaryKey: false,
        field: "road_type",
        autoIncrement: false
    }
}, {
    sequelize,
    modelName: "billboard_locations",
});

const validateBillboard = (billboard) => {
    const schema = Joi.object({
        billboardi: Joi.string().max(254),
        routename: Joi.string().max(254),
        scoutname: Joi.string().max(254),
        date_: Joi.date().max(254),
        mediaowner: Joi.string().max(254),
        selectmedi: Joi.string().max(254),
        billboard_: Joi.string().max(254),
        customerin: Joi.string().max(254),
        customerbr: Joi.string().max(254),
        site_light: Joi.string().max(254),
        zone_: Joi.string().max(254),
        direction_: Joi.string().max(254),
        size_: Joi.string().max(254),
        orientatio: Joi.string().max(254),
        site_run_u: Joi.string().max(254),
        condition: Joi.string().max(254),
        visibility: Joi.string().max(254),
        traffic: Joi.string().max(254),
        angle: Joi.string().max(254),
        photo: Joi.string().max(254),
        photo_long: Joi.string().max(254),
        height: Joi.string().max(254),
        lat: Joi.number().required(),
        long_: Joi.number().required(),
        constituen: Joi.string().max(254),
        road_type: Joi.string().max(254),
    })
    return schema.validate(billboard)
}

exports.Billboard = Billboard;
exports.validateBillboard = validateBillboard;