const {
    DataTypes
} = require('sequelize');

module.exports = sequelize => {
    const attributes = {
        ogr_fid: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: null,
            comment: null,
            primaryKey: true,
            field: "ogr_fid",
            autoIncrement: true
        },
        name: {
            type: DataTypes.CHAR(100),
            allowNull: true,
            defaultValue: null,
            comment: null,
            primaryKey: false,
            field: "name",
            autoIncrement: false
        },
        boundary: {
            type: DataTypes.CHAR(32),
            allowNull: true,
            defaultValue: null,
            comment: null,
            primaryKey: false,
            field: "boundary",
            autoIncrement: false
        },
        adminlevel: {
            type: DataTypes.CHAR(4),
            allowNull: true,
            defaultValue: null,
            comment: null,
            primaryKey: false,
            field: "adminlevel",
            autoIncrement: false
        },
        landuse: {
            type: DataTypes.CHAR(8),
            allowNull: true,
            defaultValue: null,
            comment: null,
            primaryKey: false,
            field: "landuse",
            autoIncrement: false
        },
        parent: {
            type: DataTypes.CHAR(100),
            allowNull: true,
            defaultValue: null,
            comment: null,
            primaryKey: false,
            field: "parent",
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
    };
    const options = {
        tableName: "mathare",
        comment: "",
        indexes: [{
            name: "mathare_wkb_geometry_geom_idx",
            unique: false,
            fields: ["wkb_geometry"]
        }]
    };
    const MathareModel = sequelize.define("mathare_model", attributes, options);
    return MathareModel;
};