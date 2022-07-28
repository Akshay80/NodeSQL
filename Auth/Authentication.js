const express = require("express");
const router = express.Router();
const db = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { response } = require("express");

// SignUp
router.post("/signup", async (req, res) => {
  try {
    const hashPassword = bcrypt.hashSync(req.body.password, 10);
    const hashConfirmPassword = bcrypt.hashSync(req.body.confirmpassword, 10);
    if (
      !(
        req.body.email &&
        req.body.firstname &&
        req.body.lastname &&
        req.body.password &&
        req.body.confirmpassword
      )
    ) {
      return res.status(400).send({ error: "All input fields are required" });
    }

    if (req.body.password === req.body.confirmpassword) {
      const repemailCheck = await db.Users.findOne({
        where: {
          email: req.body.email,
        },
      });
      console.log("Email coming from DB: ", repemailCheck);
      if (repemailCheck === null) {
        var users = await db.Users.create({
          firstName: req.body.firstname,
          lastName: req.body.lastname,
          email: req.body.email,
          // phone: req.body.phone,
          password: hashPassword,
          cpassword: hashConfirmPassword,
          // token: tokens
        });

        // const token = jwt.sign(
        //   {
        //     user_id: users.id,
        //     firstName: users.firstName,
        //     lastName: users.lastName,
        //     email: users.email,
        //   },
        //   process.env.ACCESS_SECRET_KEY
        // );

        // const response = {
        //   firstname: req.body.firstname,
        //   lastName: req.body.lastname,
        //   email: req.body.email,
        //   phone: req.body.phone,
        // };

        // const userVerification = await jwt.verify(
        //   token,
        //   process.env.ACCESS_SECRET_KEY
        // );
        // console.log("USER VERIFICATION : ", userVerification);

        return res.status(201).json({ message: "Signup Successful" });
      }
      res.status(404).send({ error: "Email Already Exists in our DB!" });
    } else {
      res.status(400).send({ error: "Password Mismatch!" });
    }
  } catch (error) {
    console.log(error);
  }
});

// Login
router.post("/login", async (req, res) => {
  const emailCheck = await db.Users.findOne({
    where: {
      email: req.body.email,
    },
  });

  if (!emailCheck) {
    res.send({ success: false, error: "Email Not Found!" });
  } else {
    var Validpass = await db.Users.findOne({
      where: { email: req.body.email },
    });

    const Comparedpassword = await bcrypt.compareSync(
      req.body.password,
      Validpass.password
    );
    if (Comparedpassword === false) {
      res.send({ success: false, error: "Incorrect Password!" });
    } else {
      var response = await db.Users.findOne({
        where: { email: req.body.email },
        attributes: { exclude: ["password", "cpassword"] },
      });

     const token = jwt.sign(
        {
          id: response.id,
          firstName: response.firstName,
          lastName: response.firstName,
          email: response.email,
        },
        process.env.ACCESS_SECRET_KEY
      );

      res.status(200).send({
        success: true,
        message: "Login Successful",
        data: response,
        token: token,
      });
    }
  }
});

module.exports = router;
