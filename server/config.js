module.exports = {
  secret: "SomeSecretString"
};

const config = require("./config.json");
const defaultConfig = config.development;
const environment = process.env.NODE_ENV || "development";
const environmentConfig = config[environment];
const finalConfig = Object.assign(defaultConfig, environmentConfig);

global.gConfig = finalConfig;

module.exports = finalConfig;
