const {DataTypes} = require('sequelize');

class Boundary extends Model {};

Boundary.init({
    ogc_fid: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: null,
        comment: null,
        primaryKey: true,
        field: "ogc_fid",
        autoIncrement: true
    },
    name: {
        type: DataTypes.CHAR(254),
        allowNull: false,
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
}, {
    sequelize,
    timestamps: false,
    tableName: "boundaries",
    comment: "",
    indexes: [{
        name: "boundaries_wkb_geometry_geom_idx",
        unique: false,
        fields: ["wkb_geometry"]
    }],
    modelName: 'boundaries_model'
})