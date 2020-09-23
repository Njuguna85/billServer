const {
    DataTypes
} = require('sequelize');

module.exports = sequelize => {
    const attributes = {
        full_id: {
            type: DataTypes.CHAR,
            allowNull: false,
            defaultValue: null,
            comment: null,
            primaryKey: true,
            field: "full_id",
            autoIncrement: false
        },
        geom: {
            type: DataTypes.GEOMETRY('POINT', 4326),
            allowNull: true,
            defaultValue: null,
            comment: null,
            primaryKey: false,
            field: "geom",
            autoIncrement: false
        },
        osm_type: {
            type: DataTypes.CHAR(254),
            allowNull: true,
            defaultValue: null,
            comment: null,
            primaryKey: false,
            field: "osm_type",
            autoIncrement: false
        },
        addr_city: {
            type: DataTypes.CHAR(254),
            allowNull: true,
            defaultValue: null,
            comment: null,
            primaryKey: false,
            field: "addr_city",
            autoIncrement: false
        },
        addr_stree: {
            type: DataTypes.CHAR(254),
            allowNull: true,
            defaultValue: null,
            comment: null,
            primaryKey: false,
            field: "addr_stree",
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
        }
    };
    const options = {
        tableName: "universities",
        comment: "",
        indexes: [{
            name: "sidx_universities_geom",
            unique: false,
            fields: ["geom"]
        }]
    };
    const UniversitiesModel = sequelize.define("universities_model", attributes, options);
    return UniversitiesModel;
};