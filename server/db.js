const findById = (id, cb) => {
  cb(null, { id, email: "abc@def.gh" });
};

const authenticate = (userName, password, cb) => {
  cb(null, { userName, password });
};

module.exports = {
  findById,
  authenticate
};
