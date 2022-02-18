const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//REGISTER
router.post("/register", async (req, res) => {
  const saltPassword = await bcrypt.genSalt(10);
  const securePassword = await bcrypt.hash(req.body.password, saltPassword);

  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: securePassword,
  });
  try {
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(500).json(err);
  }
});

//LOGIN

router.post("/login", async (req, res) => {
  const user = await User.findOne({ username: req.body.username });

  if (user == null) {
    return res.status(400).send("cannot find user");
  }
  try {
    if (await bcrypt.compare(req.body.password, user.password)) {
      const accessToken = jwt.sign(
        {
          id: user._id,
          isAdmin: user.isAdmin,
        },
        process.env.JWT_SEC,
        { expiresIn: "3d" }
      );

      const { password, ...others } = user._doc;

      res.status(201).json({ ...others, accessToken });
    } else {
      res.send("Wrong Password");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
