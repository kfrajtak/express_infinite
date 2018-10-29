"use strict";

const logger = require("./logger")("flash");

module.exports = () => {
  return (req, res, next) => {
    req.flash = _flash;
    const messages = _getMessages(req)();
    res.locals.getMessages = messages;

    res.header(
      "X-HL-Flash",
      Buffer.from(
        encodeURIComponent(JSON.stringify(res.locals.getMessages))
      ).toString("base64")
    );
    next();
  };
};

// Create messages
function _flash({ type, text }) {
  if (this.session === undefined) {
    throw Error("req.flash() requires sessions");
  }
  const msgs = (this.session.flash = this.session.flash || []);
  if (!text) {
    text = type;
    type = "info";
  }

  msgs.push({ type, text });
  logger.info("flash " + JSON.stringify(msgs));
}

// Get all messages
function _getMessages(req) {
  return () => {
    if (req.session === undefined) {
      throw Error("getMessages() requires sessions");
    }
    const msgs = (req.session.flash = req.session.flash || []);
    req.session.flash = [];
    return msgs || [];
  };
}
