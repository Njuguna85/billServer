const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class Role extends Model {};

Role.init({
    role: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    type: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'general'
    }
}, {
    sequelize,
    timestamps: false,
    modelName: 'role',
    freezeTableName: true
})


module.exports = Role;