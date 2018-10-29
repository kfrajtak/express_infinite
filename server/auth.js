const passport = require("passport");
const { Strategy } = require("passport-local");
const db = require("./db");

// Configure the local strategy for use by Passport.
//
// The local strategy require a `verify` function which receives the credentials
// (`username` and `password`) submitted by the user.  The function must verify
// that the password is correct and then invoke `cb` with a user object, which
// will be set at `req.user` in route handlers after authentication.
passport.use(
  new Strategy((userName, password, cb) => {
    db.authenticate(userName, password, cb);
  })
);

// Configure Passport authenticated session persistence.
//
// In order to restore authentication state across HTTP requests, Passport needs
// to serialize users into and deserialize users out of the session.  The
// typical implementation of this is as simple as supplying the user ID when
// serializing, and querying the user record by ID from the database when
// deserializing.
passport.serializeUser((user, cb) => {
  cb(null, user.id);
});

passport.deserializeUser((id, cb) => {
  db.findById(id, (err, user) => {
    if (err) {
      cb(err);
      return;
    }
    cb(null, user);
  });
});

function ensureLoggedIn(req, res, next) {
  if (!req.isAuthenticated || !req.isAuthenticated()) {
    res.status(401);
    res.send("Authorization required.");
  } else {
    next();
  }
}

module.exports = {
  ensureLoggedIn
};
