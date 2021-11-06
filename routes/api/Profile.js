const express = require("express");
const Profile = require("../../models/Profile");
const Auth = require("../../utils/auth");
const router = express.Router();
const User = require("../../models/User");
const { check, validationResult } = require("express-validator");
const request = require('request');
// const axios = require('axios');
const config = require('config');



// @route GET api/Profile/me
// @desc Get single User profile
// @access Private
router.get("/me", Auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id }).populate("user",["username", "avatar"]);

    if (!profile) {
      return res.status(400).json({ message: "No profile for this user" });
    }

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route GET api/profile/
// @desc Get all User profiles in the DB
// @access Public
router.get("/", async (req, res) => {
  try {
    const allUserProfiles = await Profile.find({}).populate("user", ["username","avatar",]);

    if (!allUserProfiles) {
      res.status(400).json({ message: "No User Profiles Found" });
    }

    console.log(allUserProfiles);
    res.json(allUserProfiles);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

// @route GET api/profile/users/:user_id
// @desc Get one User profile by user_id
// @access Public
router.get("/user/:user_id", async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.params.user_id,
    }).populate("user", ["username", "avatar"]);

    if (!profile) {
      res.status(400).json({ message: "No User Profile Found" });
    }

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    if (err.kind == "ObjectId") {
      // if error.kind = ObjId, throw same 'No Profile' message
      res.status(400).json({ message: "No User Profile Found" });
    }
    res.status(500).send("Server Error");
  }
});

// @route GET api/profile/github/:username
// @desc Get User github repos
// @access Public
router.get('/github/:username', (req, res) => {
    try {
        const options = {
            uri: `https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc&client_id=${config.get('githubClientID')}&client_secret=${config.get('githubSecret')}`,
            method: "GET",
            //dont know why but need header
            headers: {
                'user-agent': 'node.js'
            }
        }

        request(options, (error, response, body) => {
            if (error) res.json({message: error})

            if (response.statusCode !== 200){
              return  res.status(400).json({message: 'No Github Found'})
            }

            res.json(JSON.parse(body))
        })
    } catch(err){
        console.log(err);
        res.status(500).send('Server Error')
    }
})


// @route POST api/Profile/
// @desc create or update a User profile
// @access Private
router.post("/",
  [
    Auth,
    [
      check("status", "status is required").not().isEmpty(),
      check("skills", "skills is required").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);

    //check the errors array is empty
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // destructure the request
    const {
      company,
      website,
      location,
      skills,
      bio,
      status,
      githubusername,
      youtube,
      twitter,
      instagram,
      linkedin,
      facebook,
    } = req.body;
    //Build Profile object
    const profileFields = {};
    profileFields.user = req.user.id;
    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;
    if (status) profileFields.status = status;
    if (githubusername) profileFields.githubusername = githubusername;
    if (skills) {
      // .split transforms string list into array
      profileFields.skills = skills.split(",").map((skill) => skill.trim());
    }
    //Build Social Object
    profileFields.social = {};
    if (youtube) profileFields.social.youtube = youtube;
    if (linkedin) profileFields.social.linkedin = linkedin;
    if (twitter) profileFields.social.twitter = twitter;
    if (facebook) profileFields.social.facebook = facebook;
    if (instagram) profileFields.social.instagram = instagram;

    try {
      // look for matching profile, with ID from token on req.user.id?
      let profile = await Profile.findOne({ user: req.user.id });

      if (profile) {
        //Update
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        );

        return res.json(profile);
      }
      //if no profile already, create new Profile
      profile = new Profile(profileFields);

      await profile.save();
      res.json(profile);
    } catch (err) {
      console.error({ msg: err.message });
      res.status(500).send("Cannot create user profile");
    }
  }
);

// @route PUT api/profile/experience
// @desc UPDATES the User Profile Experience Array
// @access Private
router.put("/experience",
  [
    Auth,
    [
      check("title", "must include a title").not().isEmpty(),
      check("company", "must include a company").not().isEmpty(),
      check("from", "must include a fromDate").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { title, company, location, from, to, current, description } =
      req.body;

    const newEXP = {
      title,
      company,
      location,
      from,
      to,
      current,
      description,
    };

    try {
      const profile = await Profile.findOne({ user: req.user.id });
      //.unshift same as .push but adds new item to FRONT of array
      profile.experience.unshift(newEXP);

      await profile.save();
      res.json(profile);
    } catch (err) {
      console.error(err);
      res.status(500).send("Server Error");
    }
  }
);

// @route DELETE api/profile/experience
// @desc DELETES an experience object from Profile experience
// @access Private
router.delete("/experience/:id", Auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });

    const filteredExp = profile.experience.filter(
      (exp) => exp.id !== req.params.id
    );

    profile.experience = filteredExp;
    await profile.save();

    res.json(profile);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err });
  }
});

// @route PUT api/profile/education
// @desc UPDATES the User Profile Education Array
// @access Private
router.put("/education",
  [
    Auth,
    [
      check("school", "must include a school").not().isEmpty(),
      check("degree", "must include a degree").not().isEmpty(),
      check("fieldofstudy", "must include a fieldOfStudy").not().isEmpty(),
      check("from", "must include a fromDate").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { school, degree, fieldofstudy, from, current, to, description } = req.body;

    const newEducation = {
      school,
      degree,
      fieldofstudy,
      from,
      current,
      to,
      description,
    };

    try {
      const profile = await Profile.findOne({ user: req.user.id });
      //.unshift same as .push but adds new item to FRONT of array
      profile.education.unshift(newEducation);

      await profile.save();
      res.json(profile);
    } catch (err) {
      console.error(err);
      res.status(500).send("Server Error");
    }
  }
);

// @route DELETE api/profile/education
// @desc DELETES an education object from Profile education
// @access Private
router.delete("/education/:id", Auth, async (req, res) => {
    try {
      const profile = await Profile.findOne({ user: req.user.id });
      const filteredEducation = profile.education.filter((edu) => edu.id !== req.params.id);

      profile.education = filteredEducation;
      await profile.save();

      res.json(profile);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: err });
    }
  });

// @route DELETE api/profile/users/:user_id
// @desc Deletes the User and their associated Profile/Posts
// @access Private
router.delete("/", Auth, async (req, res) => {
  try {
    await Profile.findOneAndDelete({ user: req.user.id });
    await User.findOneAndDelete({ _id: req.user.id });

    res.json({ msg: "User Deleted" });
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
