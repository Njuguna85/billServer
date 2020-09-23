const {
    DataTypes
} = require('sequelize');

module.exports = sequelize => {
    const attributes = {
        objectid: {
            type: DataTypes.BIGINT,
            allowNull: false,
            defaultValue: null,
            comment: null,
            primaryKey: true,
            field: "objectid",
            autoIncrement: false
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
        subcounty: {
            type: DataTypes.CHAR(50),
            allowNull: true,
            defaultValue: null,
            comment: null,
            primaryKey: false,
            field: "subcounty",
            autoIncrement: false
        },
        fid_: {
            type: DataTypes.BIGINT,
            allowNull: true,
            defaultValue: null,
            comment: null,
            primaryKey: false,
            field: "fid_",
            autoIncrement: false
        },
        district: {
            type: DataTypes.CHAR(254),
            allowNull: true,
            defaultValue: null,
            comment: null,
            primaryKey: false,
            field: "district",
            autoIncrement: false
        },
        county: {
            type: DataTypes.CHAR(254),
            allowNull: true,
            defaultValue: null,
            comment: null,
            primaryKey: false,
            field: "county",
            autoIncrement: false
        },
        popn: {
            type: DataTypes.BIGINT,
            allowNull: true,
            defaultValue: null,
            comment: null,
            primaryKey: false,
            field: "popn",
            autoIncrement: false
        },
        shape__are: {
            type: DataTypes.DOUBLE,
            allowNull: true,
            defaultValue: null,
            comment: null,
            primaryKey: false,
            field: "shape__are",
            autoIncrement: false
        },
        shape__len: {
            type: DataTypes.DOUBLE,
            allowNull: true,
            defaultValue: null,
            comment: null,
            primaryKey: false,
            field: "shape__len",
            autoIncrement: false
        }
    };
    const options = {
        tableName: "ugSubCountiesPop2014",
        comment: "",
        indexes: []
    };
    const UgSubCountiesPop2014Model = sequelize.define("ugSubCountiesPop2014_model", attributes, options);
    return UgSubCountiesPop2014Model;
};