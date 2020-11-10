const path = require("path");
const express = require("express");
const app = express();
const passport = require("passport");
const session = require("express-session");
const dotenv = require("dotenv");
// set the path of config file
dotenv.config({ path: "./config/config.env" });
const billboards = require("./routes/billboards");
const exhbs = require("express-handlebars");
const morgan = require("morgan");
const index = require("./routes/index");
require("./models/models");
const logger = require("./controllers/logger");

// use the json payload for body requests
app.use(express.json());

app.use(express.urlencoded({ extended: true }));
// use morgan to log request
app.use(morgan("combined", { stream: logger.stream }));

// passport configuration
// pass the passport var by reference
require("./config/passport-config")(passport);

// use express js sessinons
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    // dont save a session if nothing is modified
    resave: false,
    // dont create a session until something is stored
    saveUninitialized: false,
  })
);

// add passport middleware
// initialize and passports sessions
app.use(passport.initialize());
app.use(passport.session());

// handlebars set it to use .hbs extension
// set the default layout to main
app.engine(".hbs", exhbs({ defaultLayout: "main", extname: ".hbs" }));
app.set("view engine", ".hbs");

// set the static folder
app.use(express.static(path.join(__dirname, "public")));

// routes
app.use("/auth", require("./routes/auth"));
app.use("/", index);
app.use("/roles", require("./routes/roles"));

// set the access the route of billboards
app.use("/api/billboards", billboards);

app.use("/api/businesses", require("./routes/business"));

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Listening to port ${port}`);
});
