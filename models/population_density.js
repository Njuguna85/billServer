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
        subloactio: {
            type: DataTypes.CHAR(100),
            allowNull: true,
            defaultValue: null,
            comment: null,
            primaryKey: false,
            field: "subloactio",
            autoIncrement: false
        },
        areasqkm: {
            type: DataTypes.DOUBLE,
            allowNull: true,
            defaultValue: null,
            comment: null,
            primaryKey: false,
            field: "areasqkm",
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
        },
        id: {
            type: DataTypes.CHAR(254),
            allowNull: true,
            defaultValue: null,
            comment: null,
            primaryKey: false,
            field: "id",
            autoIncrement: false
        },
        sourcecoun: {
            type: DataTypes.CHAR(254),
            allowNull: true,
            defaultValue: null,
            comment: null,
            primaryKey: false,
            field: "sourcecoun",
            autoIncrement: false
        },
        enrich_fid: {
            type: DataTypes.DOUBLE,
            allowNull: true,
            defaultValue: null,
            comment: null,
            primaryKey: false,
            field: "enrich_fid",
            autoIncrement: false
        },
        aggregatio: {
            type: DataTypes.CHAR(254),
            allowNull: true,
            defaultValue: null,
            comment: null,
            primaryKey: false,
            field: "aggregatio",
            autoIncrement: false
        },
        population: {
            type: DataTypes.DOUBLE,
            allowNull: true,
            defaultValue: null,
            comment: null,
            primaryKey: false,
            field: "population",
            autoIncrement: false
        },
        apportionm: {
            type: DataTypes.DOUBLE,
            allowNull: true,
            defaultValue: null,
            comment: null,
            primaryKey: false,
            field: "apportionm",
            autoIncrement: false
        },
        hasdata: {
            type: DataTypes.DOUBLE,
            allowNull: true,
            defaultValue: null,
            comment: null,
            primaryKey: false,
            field: "hasdata",
            autoIncrement: false
        },
        totpop_cy: {
            type: DataTypes.DOUBLE,
            allowNull: true,
            defaultValue: null,
            comment: null,
            primaryKey: false,
            field: "totpop_cy",
            autoIncrement: false
        },
        pppc_cy: {
            type: DataTypes.DOUBLE,
            allowNull: true,
            defaultValue: null,
            comment: null,
            primaryKey: false,
            field: "pppc_cy",
            autoIncrement: false
        },
        males_cy: {
            type: DataTypes.DOUBLE,
            allowNull: true,
            defaultValue: null,
            comment: null,
            primaryKey: false,
            field: "males_cy",
            autoIncrement: false
        },
        females_cy: {
            type: DataTypes.DOUBLE,
            allowNull: true,
            defaultValue: null,
            comment: null,
            primaryKey: false,
            field: "females_cy",
            autoIncrement: false
        },
        page01_cy: {
            type: DataTypes.DOUBLE,
            allowNull: true,
            defaultValue: null,
            comment: null,
            primaryKey: false,
            field: "page01_cy",
            autoIncrement: false
        },
        page02_cy: {
            type: DataTypes.DOUBLE,
            allowNull: true,
            defaultValue: null,
            comment: null,
            primaryKey: false,
            field: "page02_cy",
            autoIncrement: false
        },
        page03_cy: {
            type: DataTypes.DOUBLE,
            allowNull: true,
            defaultValue: null,
            comment: null,
            primaryKey: false,
            field: "page03_cy",
            autoIncrement: false
        },
        page04_cy: {
            type: DataTypes.DOUBLE,
            allowNull: true,
            defaultValue: null,
            comment: null,
            primaryKey: false,
            field: "page04_cy",
            autoIncrement: false
        },
        page05_cy: {
            type: DataTypes.DOUBLE,
            allowNull: true,
            defaultValue: null,
            comment: null,
            primaryKey: false,
            field: "page05_cy",
            autoIncrement: false
        },
        tothh_cy: {
            type: DataTypes.DOUBLE,
            allowNull: true,
            defaultValue: null,
            comment: null,
            primaryKey: false,
            field: "tothh_cy",
            autoIncrement: false
        },
        avghhsz_cy: {
            type: DataTypes.DOUBLE,
            allowNull: true,
            defaultValue: null,
            comment: null,
            primaryKey: false,
            field: "avghhsz_cy",
            autoIncrement: false
        },
        educ01a_cy: {
            type: DataTypes.DOUBLE,
            allowNull: true,
            defaultValue: null,
            comment: null,
            primaryKey: false,
            field: "educ01a_cy",
            autoIncrement: false
        },
        educ02a_cy: {
            type: DataTypes.DOUBLE,
            allowNull: true,
            defaultValue: null,
            comment: null,
            primaryKey: false,
            field: "educ02a_cy",
            autoIncrement: false
        },
        educ03a_cy: {
            type: DataTypes.DOUBLE,
            allowNull: true,
            defaultValue: null,
            comment: null,
            primaryKey: false,
            field: "educ03a_cy",
            autoIncrement: false
        },
        educ04a_cy: {
            type: DataTypes.DOUBLE,
            allowNull: true,
            defaultValue: null,
            comment: null,
            primaryKey: false,
            field: "educ04a_cy",
            autoIncrement: false
        },
        educ05a_cy: {
            type: DataTypes.DOUBLE,
            allowNull: true,
            defaultValue: null,
            comment: null,
            primaryKey: false,
            field: "educ05a_cy",
            autoIncrement: false
        },
        educ06a_cy: {
            type: DataTypes.DOUBLE,
            allowNull: true,
            defaultValue: null,
            comment: null,
            primaryKey: false,
            field: "educ06a_cy",
            autoIncrement: false
        },
        educ07a_cy: {
            type: DataTypes.DOUBLE,
            allowNull: true,
            defaultValue: null,
            comment: null,
            primaryKey: false,
            field: "educ07a_cy",
            autoIncrement: false
        },
        educ08a_cy: {
            type: DataTypes.DOUBLE,
            allowNull: true,
            defaultValue: null,
            comment: null,
            primaryKey: false,
            field: "educ08a_cy",
            autoIncrement: false
        },
        educ09a_cy: {
            type: DataTypes.DOUBLE,
            allowNull: true,
            defaultValue: null,
            comment: null,
            primaryKey: false,
            field: "educ09a_cy",
            autoIncrement: false
        },
        pop_densit: {
            type: DataTypes.DOUBLE,
            allowNull: true,
            defaultValue: null,
            comment: null,
            primaryKey: false,
            field: "pop_densit",
            autoIncrement: false
        },
        hhld_densi: {
            type: DataTypes.DOUBLE,
            allowNull: true,
            defaultValue: null,
            comment: null,
            primaryKey: false,
            field: "hhld_densi",
            autoIncrement: false
        },
        area_sqkm: {
            type: DataTypes.DOUBLE,
            allowNull: true,
            defaultValue: null,
            comment: null,
            primaryKey: false,
            field: "area_sqkm",
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
        tableName: "population_density",
        comment: "",
        indexes: [{
            name: "population_density_wkb_geometry_geom_idx",
            unique: false,
            fields: ["wkb_geometry"]
        }]
    };
    const PopulationDensityModel = sequelize.define("population_density_model", attributes, options);
    return PopulationDensityModel;
};