const express = require("express");
//npm validator to check data types
const { validationResult, check } = require("express-validator");
const gravatar = require('gravatar');
const router = express.Router();
const User = require('../../models/User');
const { signToken } = require('../../utils/auth');
const jwt = require('jsonwebtoken');
const config = require('config');
const secret = config.get('secret');
const bcrypt = require('bcrypt');

const expiration = '2h'


// @route GET api/users
// @desc register user
// @access Public
router.post("/",
  [
    check("username", "username is required")
    .not()
    .isEmpty(),

    check('email', 'valid email is required').isEmail(),

    check('password', 'enter a minimum 6 char password').isLength({min: 6})
  ],
  async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
      }
    console.log(req.body);
    const { username, email, password } = req.body;
     try {
         // same as ({email: email})
      let user = await User.findOne({email: email})

      if (user){
      return res.status(400).json({ errors: [{msg: 'User already exists'}]})
      }
      //get user avatar
      const avatar = gravatar.url(email, {
          s: '200',
          r: 'pg',
          d: 'mm'
      });

      user = new User({ username, email, password, avatar})
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      await user.save(); 
      
      const payload = {
          user: {
              id: user.id
          }
      }

      jwt.sign(payload, secret, {expiresIn: expiration}, (err, token) => {
          if (err) throw err
          res.json({ token })
      })

    //   res.send(req.body);
     }  catch(err){
         console.error(err.message)
         res.status(500).send("Server Error")
     }
    // check if user exists
    //if so, send error
    // get users gravatar 
    // bcrypt password 
    // return token 

  }
);

module.exports = router;
