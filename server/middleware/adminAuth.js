const User = require("../models/User");

module.exports = async function (req, res, next) {
  try {
    const user = await User.findById(req.user.id);

    if (!user || !user.isAdminUser()) {
      return res.status(403).json({ msg: "Admin access denied" });
    }

    next();
  } catch (err) {
    res.status(500).send("Server Error");
  }
};
