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
        shop: {
            type: DataTypes.CHAR(254),
            allowNull: true,
            defaultValue: null,
            comment: null,
            primaryKey: false,
            field: "shop",
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
    };
    const options = {
        tableName: "supermarket",
        comment: "",
        indexes: [{
            name: "supermarket_wkb_geometry_geom_idx",
            unique: false,
            fields: ["wkb_geometry"]
        }]
    };
    const SupermarketModel = sequelize.define("supermarket_model", attributes, options);
    return SupermarketModel;
};