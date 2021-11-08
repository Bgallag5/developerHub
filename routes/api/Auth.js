const express = require("express");
const User = require("../../models/User");
const Auth = require("../../utils/auth");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const config = require("config");
const secret = config.get("secret");
const bcrypt = require("bcrypt");

const expiration = "2h";

// @route GET api/Auth
// @desc Test route
// @access Public
router.get("/", Auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }

  // res.send('Auth route hit')
});

// @route POST api/auth
// @desc Authenticate User and get token
// @access Public
router.post(
  "/",
  [
    check("email", "valid email is required").isEmail(),

    check("password", "Password is required").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    try {
      // same as ({email: email})
      let user = await User.findOne({ email });

      //same err message for both email/password, security reason
      // bad to be able to know if specific users do/not exist
      if (!user) {
        return res
          .status(404)
          .json({ errors: [{ msg: "Invalid Credentials No User" }] });
      }

      const isCorrectPassword = await bcrypt.compare(password, user.password);
      if (!isCorrectPassword) {
        return res
          .status(404)
          .json({ errors: [{ msg: "Invalid Credentials" }] });
      }

      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(payload, secret, { expiresIn: expiration }, (err, token) => {
        if (err) throw err;
        res.json({ token });
      });

      //   res.send(req.body);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
    // check if user exists
    //if so, send error
    // get users gravatar
    // bcrypt password
    // return token
  }
);

module.exports = router;
