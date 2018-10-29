const auth = require("./../auth");

let wrap = fn => (...args) => fn(...args).catch(args[2]);

module.exports = app => {
  require("./users/users")(app, auth, null, wrap);
};
