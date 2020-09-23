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
        slname: {
            type: DataTypes.CHAR(20),
            allowNull: true,
            defaultValue: null,
            comment: null,
            primaryKey: false,
            field: "slname",
            autoIncrement: false
        },
        aligned_su: {
            type: DataTypes.CHAR(254),
            allowNull: true,
            defaultValue: null,
            comment: null,
            primaryKey: false,
            field: "aligned_su",
            autoIncrement: false
        },
        subloc_20: {
            type: DataTypes.CHAR(254),
            allowNull: true,
            defaultValue: null,
            comment: null,
            primaryKey: false,
            field: "subloc_20",
            autoIncrement: false
        },
        count_: {
            type: DataTypes.DOUBLE,
            allowNull: true,
            defaultValue: null,
            comment: null,
            primaryKey: false,
            field: "count_",
            autoIncrement: false
        },
        pop_09: {
            type: DataTypes.DOUBLE,
            allowNull: true,
            defaultValue: null,
            comment: null,
            primaryKey: false,
            field: "pop_09",
            autoIncrement: false
        },
        male_09: {
            type: DataTypes.DOUBLE,
            allowNull: true,
            defaultValue: null,
            comment: null,
            primaryKey: false,
            field: "male_09",
            autoIncrement: false
        },
        female_09: {
            type: DataTypes.DOUBLE,
            allowNull: true,
            defaultValue: null,
            comment: null,
            primaryKey: false,
            field: "female_09",
            autoIncrement: false
        },
        pop_19: {
            type: DataTypes.DOUBLE,
            allowNull: true,
            defaultValue: null,
            comment: null,
            primaryKey: false,
            field: "pop_19",
            autoIncrement: false
        },
        male_19: {
            type: DataTypes.DOUBLE,
            allowNull: true,
            defaultValue: null,
            comment: null,
            primaryKey: false,
            field: "male_19",
            autoIncrement: false
        },
        female_19: {
            type: DataTypes.DOUBLE,
            allowNull: true,
            defaultValue: null,
            comment: null,
            primaryKey: false,
            field: "female_19",
            autoIncrement: false
        },
        makeshift_: {
            type: DataTypes.DOUBLE,
            allowNull: true,
            defaultValue: null,
            comment: null,
            primaryKey: false,
            field: "makeshift_",
            autoIncrement: false
        },
        pop_makesh: {
            type: DataTypes.DOUBLE,
            allowNull: true,
            defaultValue: null,
            comment: null,
            primaryKey: false,
            field: "pop_makesh",
            autoIncrement: false
        },
        total_hh: {
            type: DataTypes.DOUBLE,
            allowNull: true,
            defaultValue: null,
            comment: null,
            primaryKey: false,
            field: "total_hh",
            autoIncrement: false
        },
        hh_convern: {
            type: DataTypes.DOUBLE,
            allowNull: true,
            defaultValue: null,
            comment: null,
            primaryKey: false,
            field: "hh_convern",
            autoIncrement: false
        },
        hh_group_q: {
            type: DataTypes.CHAR(254),
            allowNull: true,
            defaultValue: null,
            comment: null,
            primaryKey: false,
            field: "hh_group_q",
            autoIncrement: false
        },
        densityper: {
            type: DataTypes.DOUBLE,
            allowNull: true,
            defaultValue: null,
            comment: null,
            primaryKey: false,
            field: "densityper",
            autoIncrement: false
        },
        percnt_50plus: {
            type: DataTypes.DOUBLE,
            allowNull: true,
            defaultValue: null,
            comment: null,
            primaryKey: false,
            field: "percnt_50plus",
            autoIncrement: false
        },
        percnt_65plus: {
            type: DataTypes.DOUBLE,
            allowNull: true,
            defaultValue: null,
            comment: null,
            primaryKey: false,
            field: "percnt_65plus",
            autoIncrement: false
        },
        percnt_pop: {
            type: DataTypes.DOUBLE,
            allowNull: true,
            defaultValue: null,
            comment: null,
            primaryKey: false,
            field: "percnt_pop",
            autoIncrement: false
        },
        improved_w: {
            type: DataTypes.DOUBLE,
            allowNull: true,
            defaultValue: null,
            comment: null,
            primaryKey: false,
            field: "improved_w",
            autoIncrement: false
        },
        unimproved: {
            type: DataTypes.DOUBLE,
            allowNull: true,
            defaultValue: null,
            comment: null,
            primaryKey: false,
            field: "unimproved",
            autoIncrement: false
        },
        likely_pri: {
            type: DataTypes.DOUBLE,
            allowNull: true,
            defaultValue: null,
            comment: null,
            primaryKey: false,
            field: "likely_pri",
            autoIncrement: false
        },
        open_waste: {
            type: DataTypes.DOUBLE,
            allowNull: true,
            defaultValue: null,
            comment: null,
            primaryKey: false,
            field: "open_waste",
            autoIncrement: false
        },
        percent_mo: {
            type: DataTypes.DOUBLE,
            allowNull: true,
            defaultValue: null,
            comment: null,
            primaryKey: false,
            field: "percent_mo",
            autoIncrement: false
        },
        mean_habit: {
            type: DataTypes.DOUBLE,
            allowNull: true,
            defaultValue: null,
            comment: null,
            primaryKey: false,
            field: "mean_habit",
            autoIncrement: false
        },
        median_hab: {
            type: DataTypes.DOUBLE,
            allowNull: true,
            defaultValue: null,
            comment: null,
            primaryKey: false,
            field: "median_hab",
            autoIncrement: false
        },
        informal_s: {
            type: DataTypes.DOUBLE,
            allowNull: true,
            defaultValue: null,
            comment: null,
            primaryKey: false,
            field: "informal_s",
            autoIncrement: false
        },
        selfemploy: {
            type: DataTypes.DOUBLE,
            allowNull: true,
            defaultValue: null,
            comment: null,
            primaryKey: false,
            field: "selfemploy",
            autoIncrement: false
        },
        percent_in: {
            type: DataTypes.DOUBLE,
            allowNull: true,
            defaultValue: null,
            comment: null,
            primaryKey: false,
            field: "percent_in",
            autoIncrement: false
        },
        ratio_avg_: {
            type: DataTypes.DOUBLE,
            allowNull: true,
            defaultValue: null,
            comment: null,
            primaryKey: false,
            field: "ratio_avg_",
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
        tableName: "nairobisublocations",
        comment: "",
        indexes: [{
            name: "nairobisublocations_wkb_geometry_geom_idx",
            unique: false,
            fields: ["wkb_geometry"]
        }]
    };
    const NairobisublocationsModel = sequelize.define("nairobisublocations_model", attributes, options);
    return NairobisublocationsModel;
};