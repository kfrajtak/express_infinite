module.exports = (app, auth, seq, wrap) => {
  app.get(
    "/api/user/:id([0-9]{0,10})?",
    auth.ensureLoggedIn,
    wrap(async (req, res) => {
      res.json({ users: [{}] });
    })
  );
};
