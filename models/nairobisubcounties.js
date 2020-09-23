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
        subcontnam: {
            type: DataTypes.CHAR(50),
            allowNull: true,
            defaultValue: null,
            comment: null,
            primaryKey: false,
            field: "subcontnam",
            autoIncrement: false
        },
        total5abov: {
            type: DataTypes.CHAR(254),
            allowNull: true,
            defaultValue: null,
            comment: null,
            primaryKey: false,
            field: "total5abov",
            autoIncrement: false
        },
        male5above: {
            type: DataTypes.CHAR(254),
            allowNull: true,
            defaultValue: null,
            comment: null,
            primaryKey: false,
            field: "male5above",
            autoIncrement: false
        },
        fema5above: {
            type: DataTypes.CHAR(254),
            allowNull: true,
            defaultValue: null,
            comment: null,
            primaryKey: false,
            field: "fema5above",
            autoIncrement: false
        },
        totaldisab: {
            type: DataTypes.CHAR(254),
            allowNull: true,
            defaultValue: null,
            comment: null,
            primaryKey: false,
            field: "totaldisab",
            autoIncrement: false
        },
        maledisabl: {
            type: DataTypes.CHAR(254),
            allowNull: true,
            defaultValue: null,
            comment: null,
            primaryKey: false,
            field: "maledisabl",
            autoIncrement: false
        },
        femaledisa: {
            type: DataTypes.CHAR(254),
            allowNull: true,
            defaultValue: null,
            comment: null,
            primaryKey: false,
            field: "femaledisa",
            autoIncrement: false
        },
        totalable: {
            type: DataTypes.CHAR(254),
            allowNull: true,
            defaultValue: null,
            comment: null,
            primaryKey: false,
            field: "totalable",
            autoIncrement: false
        },
        maleable: {
            type: DataTypes.CHAR(254),
            allowNull: true,
            defaultValue: null,
            comment: null,
            primaryKey: false,
            field: "maleable",
            autoIncrement: false
        },
        femaleable: {
            type: DataTypes.CHAR(254),
            allowNull: true,
            defaultValue: null,
            comment: null,
            primaryKey: false,
            field: "femaleable",
            autoIncrement: false
        },
        totalnotst: {
            type: DataTypes.CHAR(254),
            allowNull: true,
            defaultValue: null,
            comment: null,
            primaryKey: false,
            field: "totalnotst",
            autoIncrement: false
        },
        malenotsta: {
            type: DataTypes.CHAR(254),
            allowNull: true,
            defaultValue: null,
            comment: null,
            primaryKey: false,
            field: "malenotsta",
            autoIncrement: false
        },
        femalenots: {
            type: DataTypes.CHAR(254),
            allowNull: true,
            defaultValue: null,
            comment: null,
            primaryKey: false,
            field: "femalenots",
            autoIncrement: false
        },
        percentdis: {
            type: DataTypes.CHAR(254),
            allowNull: true,
            defaultValue: null,
            comment: null,
            primaryKey: false,
            field: "percentdis",
            autoIncrement: false
        },
        totalvisua: {
            type: DataTypes.CHAR(254),
            allowNull: true,
            defaultValue: null,
            comment: null,
            primaryKey: false,
            field: "totalvisua",
            autoIncrement: false
        },
        malevisual: {
            type: DataTypes.CHAR(254),
            allowNull: true,
            defaultValue: null,
            comment: null,
            primaryKey: false,
            field: "malevisual",
            autoIncrement: false
        },
        femalevisu: {
            type: DataTypes.CHAR(254),
            allowNull: true,
            defaultValue: null,
            comment: null,
            primaryKey: false,
            field: "femalevisu",
            autoIncrement: false
        },
        totalheari: {
            type: DataTypes.CHAR(254),
            allowNull: true,
            defaultValue: null,
            comment: null,
            primaryKey: false,
            field: "totalheari",
            autoIncrement: false
        },
        malehearin: {
            type: DataTypes.CHAR(254),
            allowNull: true,
            defaultValue: null,
            comment: null,
            primaryKey: false,
            field: "malehearin",
            autoIncrement: false
        },
        femalehear: {
            type: DataTypes.CHAR(254),
            allowNull: true,
            defaultValue: null,
            comment: null,
            primaryKey: false,
            field: "femalehear",
            autoIncrement: false
        },
        totalmobil: {
            type: DataTypes.CHAR(254),
            allowNull: true,
            defaultValue: null,
            comment: null,
            primaryKey: false,
            field: "totalmobil",
            autoIncrement: false
        },
        malemobili: {
            type: DataTypes.CHAR(254),
            allowNull: true,
            defaultValue: null,
            comment: null,
            primaryKey: false,
            field: "malemobili",
            autoIncrement: false
        },
        femalemobi: {
            type: DataTypes.CHAR(254),
            allowNull: true,
            defaultValue: null,
            comment: null,
            primaryKey: false,
            field: "femalemobi",
            autoIncrement: false
        },
        totalcogni: {
            type: DataTypes.CHAR(254),
            allowNull: true,
            defaultValue: null,
            comment: null,
            primaryKey: false,
            field: "totalcogni",
            autoIncrement: false
        },
        malecognit: {
            type: DataTypes.CHAR(254),
            allowNull: true,
            defaultValue: null,
            comment: null,
            primaryKey: false,
            field: "malecognit",
            autoIncrement: false
        },
        femalecogn: {
            type: DataTypes.CHAR(254),
            allowNull: true,
            defaultValue: null,
            comment: null,
            primaryKey: false,
            field: "femalecogn",
            autoIncrement: false
        },
        totalselfc: {
            type: DataTypes.CHAR(254),
            allowNull: true,
            defaultValue: null,
            comment: null,
            primaryKey: false,
            field: "totalselfc",
            autoIncrement: false
        },
        maleselfca: {
            type: DataTypes.CHAR(254),
            allowNull: true,
            defaultValue: null,
            comment: null,
            primaryKey: false,
            field: "maleselfca",
            autoIncrement: false
        },
        femaleself: {
            type: DataTypes.CHAR(254),
            allowNull: true,
            defaultValue: null,
            comment: null,
            primaryKey: false,
            field: "femaleself",
            autoIncrement: false
        },
        totalcommu: {
            type: DataTypes.CHAR(254),
            allowNull: true,
            defaultValue: null,
            comment: null,
            primaryKey: false,
            field: "totalcommu",
            autoIncrement: false
        },
        malecommun: {
            type: DataTypes.CHAR(254),
            allowNull: true,
            defaultValue: null,
            comment: null,
            primaryKey: false,
            field: "malecommun",
            autoIncrement: false
        },
        femalecomm: {
            type: DataTypes.CHAR(254),
            allowNull: true,
            defaultValue: null,
            comment: null,
            primaryKey: false,
            field: "femalecomm",
            autoIncrement: false
        },
        totalpopul: {
            type: DataTypes.CHAR(254),
            allowNull: true,
            defaultValue: null,
            comment: null,
            primaryKey: false,
            field: "totalpopul",
            autoIncrement: false
        },
        malepopula: {
            type: DataTypes.CHAR(254),
            allowNull: true,
            defaultValue: null,
            comment: null,
            primaryKey: false,
            field: "malepopula",
            autoIncrement: false
        },
        femalepopu: {
            type: DataTypes.CHAR(254),
            allowNull: true,
            defaultValue: null,
            comment: null,
            primaryKey: false,
            field: "femalepopu",
            autoIncrement: false
        },
        totalalbin: {
            type: DataTypes.CHAR(254),
            allowNull: true,
            defaultValue: null,
            comment: null,
            primaryKey: false,
            field: "totalalbin",
            autoIncrement: false
        },
        malealbini: {
            type: DataTypes.CHAR(254),
            allowNull: true,
            defaultValue: null,
            comment: null,
            primaryKey: false,
            field: "malealbini",
            autoIncrement: false
        },
        femalealbi: {
            type: DataTypes.CHAR(254),
            allowNull: true,
            defaultValue: null,
            comment: null,
            primaryKey: false,
            field: "femalealbi",
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
        tableName: "nairobisubcounties",
        comment: "",
        indexes: [{
            name: "nairobisubcounties_wkb_geometry_geom_idx",
            unique: false,
            fields: ["wkb_geometry"]
        }]
    };
    const NairobisubcountiesModel = sequelize.define("nairobisubcounties_model", attributes, options);
    return NairobisubcountiesModel;
};