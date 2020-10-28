const sequelize = require('../config/database');
const { Billboard } = require('./Billboard')
const User = require('./User')
const Role = require('../models/Role')
const Business = require('./Business');

// emit handling:
//call this function to drop all databases and recreate them
//inside the promis we can populate the db with our initial data;
const runFirstTime = () => sequelize.sync({ force: false })
    .then(() => {
        console.log(`Database & tables created!`);
    })
    .catch(err => console.error(err))

// runFirstTime()

User.hasMany(Billboard, { foreignKey: 'user' })
Role.hasMany(User, { foreignKey: 'role' })
User.hasMany(Business, { foreignKey: 'user' })