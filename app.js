const express = require('express');
const app = express();
const billboards = require('./routes/billboards')
const passport = require('passport')
const session = require('express-session');
require('./models/models');
const cors = require('cors')

// use the json payload for body requests
app.use(express.json());

const corsOptions = {
    'Origin': '*',
    'optionsSuccessStatus': 200,
    'Access-Control-Allow-Origin': '*',
    "Access-Control-Allow-Headers": "X-Requested-With"
}

app.use(cors(corsOptions))

// since we are using form , we use urlenconded 
// this will enable the values sent from the form 
// to have a corresponding name of the input form element name
app.use(express.urlencoded({ extended: false }));

// passport configuration 
// pass the passport var by reference
require('./config/passport-config')(passport);

// use express js sessinons
app.use(session({
    secret: process.env.SESSION_SECRET,
    // dont save a session if nothing is modified
    resave: false,
    // dont create a session until something is stored
    saveUninitialized: false
}))

// add passport middleware
// initialize and passports sessions 
app.use(passport.initialize());
app.use(passport.session());

// routes
app.use('/auth', require('./routes/auth'))

// set the access the route of billboards 
app.use('/api/billboards', billboards)

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Listening to port ${port}`);
})