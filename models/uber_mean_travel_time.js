const {
    DataTypes
} = require('sequelize');

module.exports = sequelize => {
    const attributes = {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: null,
            comment: null,
            primaryKey: true,
            field: "id",
            autoIncrement: true
        },
        geom: {
            type: DataTypes.GEOMETRY('POLYGON', 4326),
            allowNull: true,
            defaultValue: null,
            comment: null,
            primaryKey: false,
            field: "geom",
            autoIncrement: false
        },
        movement_i: {
            type: DataTypes.CHAR(80),
            allowNull: true,
            defaultValue: null,
            comment: null,
            primaryKey: false,
            field: "movement_i",
            autoIncrement: false
        },
        display_na: {
            type: DataTypes.CHAR(80),
            allowNull: true,
            defaultValue: null,
            comment: null,
            primaryKey: false,
            field: "display_na",
            autoIncrement: false
        },
        moveid: {
            type: DataTypes.BIGINT,
            allowNull: true,
            defaultValue: null,
            comment: null,
            primaryKey: false,
            field: "moveid",
            autoIncrement: false
        },
        objectid_1: {
            type: DataTypes.BIGINT,
            allowNull: true,
            defaultValue: null,
            comment: null,
            primaryKey: false,
            field: "objectid_1",
            autoIncrement: false
        },
        origin_mov: {
            type: DataTypes.BIGINT,
            allowNull: true,
            defaultValue: null,
            comment: null,
            primaryKey: false,
            field: "origin_mov",
            autoIncrement: false
        },
        origin_dis: {
            type: DataTypes.CHAR(254),
            allowNull: true,
            defaultValue: null,
            comment: null,
            primaryKey: false,
            field: "origin_dis",
            autoIncrement: false
        },
        destinatio: {
            type: DataTypes.BIGINT,
            allowNull: true,
            defaultValue: null,
            comment: null,
            primaryKey: false,
            field: "destinatio",
            autoIncrement: false
        },
        destinat_1: {
            type: DataTypes.CHAR(254),
            allowNull: true,
            defaultValue: null,
            comment: null,
            primaryKey: false,
            field: "destinat_1",
            autoIncrement: false
        },
        date_range: {
            type: DataTypes.CHAR(254),
            allowNull: true,
            defaultValue: null,
            comment: null,
            primaryKey: false,
            field: "date_range",
            autoIncrement: false
        },
        mean_trave: {
            type: DataTypes.BIGINT,
            allowNull: true,
            defaultValue: null,
            comment: null,
            primaryKey: false,
            field: "mean_trave",
            autoIncrement: false
        },
        range___lo: {
            type: DataTypes.BIGINT,
            allowNull: true,
            defaultValue: null,
            comment: null,
            primaryKey: false,
            field: "range___lo",
            autoIncrement: false
        },
        range___up: {
            type: DataTypes.BIGINT,
            allowNull: true,
            defaultValue: null,
            comment: null,
            primaryKey: false,
            field: "range___up",
            autoIncrement: false
        },
        destiid: {
            type: DataTypes.BIGINT,
            allowNull: true,
            defaultValue: null,
            comment: null,
            primaryKey: false,
            field: "destiid",
            autoIncrement: false
        },
        shape_leng: {
            type: DataTypes.DOUBLE,
            allowNull: true,
            defaultValue: null,
            comment: null,
            primaryKey: false,
            field: "shape_leng",
            autoIncrement: false
        },
        shape_area: {
            type: DataTypes.DOUBLE,
            allowNull: true,
            defaultValue: null,
            comment: null,
            primaryKey: false,
            field: "shape_area",
            autoIncrement: false
        }
    };
    const options = {
        tableName: "uber_mean_travel_time",
        comment: "",
        indexes: [{
            name: "sidx_uber_mean_travel_time_geom",
            unique: false,
            fields: ["geom"]
        }]
    };
    const UberMeanTravelTimeModel = sequelize.define("uber_mean_travel_time_model", attributes, options);
    return UberMeanTravelTimeModel;
};