// this will handle user registration

const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const Profile = require("../../models/Profile");
const { check, validationResult } = require("express-validator");
const gravatars = require("gravatar");
const bcrypt = require("bcryptjs");
const User = require("../../models/User");
const Post = require("../../models/Post");

const jwt = require("jsonwebtoken");
const config = require("config");
const request = require("request");

//@Route GET api/Profiles/me
//@desc get current users profile based on userID
//access private  //Only valid token can have access to their own profile
router.get("/me", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.user.id,
    }).populate("users", ["name", "avatar"]); // populate method used to get value from user such as name and avatar.

    if (!profile) {
      return res.status(400).json({ msg: "there is no profile found" });
    }
    res.json(profile);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("server error");
  }
});
router.post(
  "/",
  [
    auth,
    [
      check("status", "status is required").not().isEmpty(),
      check("skills", "skills is required").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(400).json({ error: error.array() });
    }
    const {
      company,
      website,
      location,
      bio,
      status,
      githubUserName,
      skills,
      youtube,
      facebook,
      twitter,
      instagram,
      linkedin,
    } = req.body;
    //Build profile object
    const profileFields = {};
    profileFields.user = req.user.id;
    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;
    if (status) profileFields.status = status;
    if (githubUserName) profileFields.githubUserName = githubUserName;
    if (skills) {
      profileFields.skills = skills.split(",").map((skill) => skill.trim());
    }

    profileFields.social = {};
    if (youtube) profileFields.social.youtube = youtube;
    if (facebook) profileFields.social.facebook = facebook;
    if (twitter) profileFields.social.twitter = twitter;
    if (instagram) profileFields.social.instagram = instagram;
    if (linkedin) profileFields.social.linkedin = linkedin;

    try {
      let profile = await Profile.findOne({ user: req.user.id });
      if (profile) {
        //update
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        );
        return res.json(profile);
      }
    } catch (error) {
      console.log(error.message);
      res.status(500).send("server error");
    }
    //create
    let profile = await new Profile(profileFields);
    await profile.save();

    res.json(profile);
  }
);
//@Route GET api/Profiles/
//@desc get All profiles
//access public
router.get("/", async (req, res) => {
  try {
    const profiles = await Profile.find().populate("user", ["name", "avatar"]);
    return res.json(profiles);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("server error");
  }
});
//@Route GET api/Profiles/ID
//@desc get a profile that match userID
//access public
router.get("/user/:user_id", async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.params.user_id,
    }).populate("user", ["name", "avatar"]);
    if (!profile) {
      return res.status(400).json({ msg: "there is no profile found" });
    }
    return res.json(profile);
  } catch (error) {
    if (error.kind == "ObjectId") {
      return res.status(400).json({ msg: "there is no profile found" });
    }
    res.status(500).send("server error");
  }
});
//@Route DELETE
//@desc DELETE user,profiles,posts
//access private
router.delete("/", auth, async (req, res) => {
  try {
    await Post.deleteMany({ user: req.user.id });
    await Profile.findOneAndRemove({ user: req.user.id });
    await User.findOneAndRemove({ _id: req.user.id });
    return res.json({ msg: "delete sucessfully" });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("server error");
  }
});
//@Route Put
//@desc update experience for user's profile
//access private

router.put(
  "/experience",
  [
    auth,
    [
      //use put look like we updating not initialize
      check("title", "title is required").not().isEmpty(),
      check("company", "company is required").not().isEmpty(),
      check("from", "from date is required").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(400).json({ error: error.array() });
    }
    const check = ({
      title,
      company,
      location,
      from,
      to,
      current,
      description,
    } = req.body);
    const newExp = {
      ...check,
    };
    try {
      const profile = await Profile.findOne({ user: req.user.id });
      profile.experiences.unshift(newExp);
      await profile.save();
      res.json(profile);
    } catch (err) {
      console.log(error.message);
      res.status(500).send("server error");
    }
  }
);
//@Route Delete
//@desc delete experience of user's profile
//access private

router.delete("/experience/:exp_id", auth, async (req, res) => {
  try {
    const foundProfile = await Profile.findOne({ user: req.user.id });

    if (!foundProfile) {
      return res.status(500).json({ msg: "Server error" });
    }
    foundProfile.experiences = foundProfile.experiences.filter(
      (exp) => exp.id !== req.params.exp_id
    );
    await foundProfile.save();
    return res.status(200).json(foundProfile);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Server error" });
  }
});
//@Route Put
//@desc update education for user's profile
//access private

router.put(
  "/education",
  [
    auth,
    [
      //use put look like we updating not initialize
      check("school", "title is required").not().isEmpty(),
      check("degree", "company is required").not().isEmpty(),
      check("fieldOfStudy", "Field of study is required").not().isEmpty(),
      check("from", "from date is required").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(400).json({ error: error.array() });
    }
    const check = ({
      school,
      degree,
      fieldOfStudy,
      from,
      to,
      current,
      description,
    } = req.body);
    const newEdu = {
      ...check,
    };
    try {
      const profile = await Profile.findOne({ user: req.user.id });
      profile.education.unshift(newEdu);
      await profile.save();
      res.json(profile);
    } catch (err) {
      console.log(error.message);
      res.status(500).send("server error");
    }
  }
);
//@Route Delete
//@desc delete education of user's profile
//access private

router.delete("/education/:edu_id", auth, async (req, res) => {
  try {
    const foundProfile = await Profile.findOne({ user: req.user.id });

    if (!foundProfile) {
      return res.status(500).json({ msg: "Server error" });
    }
    foundProfile.education = foundProfile.education.filter(
      (exp) => exp.id !== req.params.edu_id
    );
    await foundProfile.save();
    return res.status(200).json(foundProfile);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Server error" });
  }
});
//@Route GET
//@desc get user repos from Git
//access public

router.get("/github/:username", (req, res) => {
  try {
    const options = {
      uri: `https://api.github.com/users/${
        req.params.username
      }/repos?per_page=5&sort=created:asc&client_
            id=${config.get("githubClientID")}&client_secret=${config.get(
        "githubSecret"
      )}`,
      method: "GET",
      headers: { "user-agent": "node.js" },
    };
    request(options, (err, respond, body) => {
      if (err) console.err(err);

      if (respond.statusCode !== 200) {
        return res.status(404).json({ msg: "no github profile found" });
      }
      res.json(JSON.parse(body));
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
