const sequelize = require('../config/database');
const { Billboard } = require('./Billboard')
const User = require('./User')

// emit handling:
//call this function to drop all databases and recreate them
//inside the promis we can populate the db with our initial data;
const runFirstTime = () => sequelize.sync({ force: true })
    .then(() => {
        console.log(`Database & tables created!`);
    })
    .catch(err => console.error(err))

// runFirstTime()

User.hasMany(Billboard, { foreignKey: 'user' })