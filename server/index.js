const express = require("express");
const passport = require("passport");
const path = require("path");
const proxy = require("http-proxy-middleware");
const session = require("express-session");
const uuid = require("uuid/v4");
const bodyParser = require("body-parser");
const helmet = require("helmet");

const logger = require("./logger")("server");

const config = require("./config");

// Create a new Express application.
const app = express();

var port = process.env.PORT || config.port;
app.set("port", port);

// Use application-level middleware for common functionality, including
// logging, parsing, and session handling.
app.use(require("cookie-parser")());
//app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(
  session({
    genid: req => {
      return uuid(); // use UUIDs for session IDs
    },
    secret: config.secret,
    resave: false,
    saveUninitialized: true
  })
);

app.use(helmet());

// Initialize Passport
app.use(passport.initialize());

// Store authentication state, if any, in the session
app.use(passport.session());

app.use(require("./flash")());

require("./api/router")(app);

if (process.env.NODE_ENV !== "production") {
  logger.info("Environment: dev ...");
  // We start a proxy to the create-react-app dev server
  // Used when we create a client/build for production
  app.use(express.static(path.join(__dirname, "..", "build")));
  const apiProxy = proxy("/", { target: "http://localhost:3000", ws: true });
  app.use(apiProxy);
} else {
  logger.info("Environment: production ...");
  // When in production
  var compression = require("compression");
  app.use(compression());
  app.use("/static", express.static(path.join(__dirname, "client", "static")));
  // All url paths go to the bundled index.html
  app.get("/*", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "index.html"));
  });
}

app.all("*", (req, res) => {
  res.status(404).send();
});

app.use((error, req, res, next) => {
  console.error(error);
  logger.error(error);
  // Will **not** get called. You'll get Express' default error
  // handler, which returns `error.toString()` in the error body
  if (error.status && error.status === 400) {
    return;
  }
  res.status(500).json({ message: error.message });
});

// Start server
app.listen(app.get("port"), () => {
  logger.info("App listening on port " + app.get("port"));
});
