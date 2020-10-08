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
    billboard_id: {
        type: DataTypes.CHAR(254),
        allowNull: true,
        defaultValue: null,
        comment: null,
        primaryKey: false,
        field: "billboardi",
        autoIncrement: false,
        unique: true
    },
    route_name: {
        type: DataTypes.CHAR(254),
        allowNull: true,
        defaultValue: null,
        comment: null,
        primaryKey: false,
        field: "routename",
        autoIncrement: false
    },
    scout_name: {
        type: DataTypes.CHAR(254),
        allowNull: true,
        defaultValue: null,
        comment: null,
        primaryKey: false,
        field: "scoutname",
        autoIncrement: false
    },
    date: {
        type: DataTypes.CHAR(254),
        allowNull: true,
        defaultValue: Date.now,
        comment: null,
        primaryKey: false,
        field: "date_",
        autoIncrement: false
    },
    media_owner: {
        type: DataTypes.CHAR(254),
        allowNull: true,
        defaultValue: null,
        comment: null,
        primaryKey: false,
        field: "mediaowner",
        autoIncrement: false
    },
    select_medium: {
        type: DataTypes.CHAR(254),
        allowNull: true,
        defaultValue: null,
        comment: null,
        primaryKey: false,
        field: "selectmedi",
        autoIncrement: false
    },
    billboard_empty: {
        type: DataTypes.CHAR(254),
        allowNull: true,
        defaultValue: null,
        comment: null,
        primaryKey: false,
        field: "billboard_",
        autoIncrement: false
    },
    customer_industry: {
        type: DataTypes.CHAR(254),
        allowNull: true,
        defaultValue: null,
        comment: null,
        primaryKey: false,
        field: "customerin",
        autoIncrement: false
    },
    customer_brand: {
        type: DataTypes.CHAR(254),
        allowNull: true,
        defaultValue: null,
        comment: null,
        primaryKey: false,
        field: "customerbr",
        autoIncrement: false
    },
    site_lighting_illumination: {
        type: DataTypes.CHAR(254),
        allowNull: true,
        defaultValue: null,
        comment: null,
        primaryKey: false,
        field: "site_light",
        autoIncrement: false
    },
    zone: {
        type: DataTypes.CHAR(254),
        allowNull: true,
        defaultValue: null,
        comment: null,
        primaryKey: false,
        field: "zone_",
        autoIncrement: false
    },
    direction_from_cbd: {
        type: DataTypes.CHAR(254),
        allowNull: true,
        defaultValue: null,
        comment: null,
        primaryKey: false,
        field: "direction_",
        autoIncrement: false
    },
    size: {
        type: DataTypes.CHAR(254),
        allowNull: true,
        defaultValue: null,
        comment: null,
        primaryKey: false,
        field: "size_",
        autoIncrement: false
    },
    orientation: {
        type: DataTypes.CHAR(254),
        allowNull: true,
        defaultValue: null,
        comment: null,
        primaryKey: false,
        field: "orientatio",
        autoIncrement: false
    },
    site_run_up: {
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
    photo_long_range: {
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
    long: {
        type: DataTypes.DOUBLE,
        allowNull: false,
        defaultValue: null,
        comment: null,
        primaryKey: false,
        field: "long_",
        autoIncrement: false
    },
    constituency: {
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
    },
    user: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1
    }
}, {
    sequelize,
    modelName: "billboard_locations",
});

const valdateBillboard = (billboard) => {
    const schema = Joi.object({
        billboard_id: Joi.string().required().trim(),
        route_name: Joi.string().trim().allow(null, ''),
        scout_name: Joi.string().trim().allow(null, ''),
        date: Joi.string(),
        media_owner: Joi.string().trim().allow(null, ''),
        select_medium: Joi.string().trim().allow(null, ''),
        billboard_empty: Joi.string().trim().allow(null, ''),
        customer_industry: Joi.string().trim().allow(null, ''),
        customer_brand: Joi.string().trim().allow(null, ''),
        site_lighting_illumination: Joi.string().trim().allow(null, ''),
        zone: Joi.string().trim().allow(null, ''),
        direction_from_cbd: Joi.string().trim().allow(null, ''),
        size: Joi.string().trim().allow(null, ''),
        orientation: Joi.string().trim().allow(null, ''),
        site_run_up: Joi.string().trim().allow(null, ''),
        condition: Joi.string().trim().allow(null, ''),
        visibility: Joi.string().trim().allow(null, ''),
        traffic: Joi.string().trim().allow(null, ''),
        angle: Joi.string().trim().allow(null, ''),
        photo: Joi.string().trim().allow(null, ''),
        photo_long_range: Joi.string().trim().allow(null, ''),
        height: Joi.string().trim().allow(null, ''),
        lat: Joi.number().required(),
        long: Joi.number().required(),
        constituency: Joi.string().trim().allow(null, ''),
        road_type: Joi.string().trim().allow(null, ''),
    });
    return schema.validate(billboard)
}

exports.Billboard = Billboard;
exports.valdateBillboard = valdateBillboard;