const {
    DataTypes
} = require('sequelize');

module.exports = sequelize => {
    const attributes = {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: "nextval(\"ugSubCountiesPopProj2020_id_seq\"::regclass)",
            comment: null,
            primaryKey: true,
            field: "id",
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
        objectid: {
            type: DataTypes.BIGINT,
            allowNull: true,
            defaultValue: null,
            comment: null,
            primaryKey: false,
            field: "objectid",
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
        objectid_1: {
            type: DataTypes.BIGINT,
            allowNull: true,
            defaultValue: null,
            comment: null,
            primaryKey: false,
            field: "objectid_1",
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
        district: {
            type: DataTypes.CHAR(254),
            allowNull: true,
            defaultValue: null,
            comment: null,
            primaryKey: false,
            field: "district",
            autoIncrement: false
        },
        male: {
            type: DataTypes.DOUBLE,
            allowNull: true,
            defaultValue: null,
            comment: null,
            primaryKey: false,
            field: "male",
            autoIncrement: false
        },
        female: {
            type: DataTypes.DOUBLE,
            allowNull: true,
            defaultValue: null,
            comment: null,
            primaryKey: false,
            field: "female",
            autoIncrement: false
        },
        total: {
            type: DataTypes.DOUBLE,
            allowNull: true,
            defaultValue: null,
            comment: null,
            primaryKey: false,
            field: "total",
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
        tableName: "ugsubcountiesprojection",
        comment: "",
        indexes: []
    };
    const UgsubcountiesprojectionModel = sequelize.define("ugsubcountiesprojection_model", attributes, options);
    return UgsubcountiesprojectionModel;
};