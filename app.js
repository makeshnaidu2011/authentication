//jshint esversion:6
require('dotenv').config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");
const md5 = require("md5");
const bcrypt = require("bcryptjs");
var salt = bcrypt.genSaltSync(10);
mongoose.connect('mongodb://localhost:27017/userDB', { useNewUrlParser: true, useUnifiedTopology: true });


const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

// userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ["password"] });
const user = new mongoose.model("user", userSchema);

// var secret = process.env.SOME_LONG_UNGUESSABLE_STRING;




app.use(express.static("public"));

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/register", (req, res) => {
    res.render("register")
});
app.post("/register", function (req, res) {
    bcrypt.hash(req.body.password, salt, function (err, hash) {
        let newUser = new user({
            email: req.body.username,
            password: hash
        })
        newUser.save(function (err) {
            if (!err) {
                res.render("secrets")

            } else {
                console.log("err");

            }
        })
    });
})

app.get("/login", function (req, res) {
    res.render("login");
})

app.post("/login", function (req, res) {
    const username = req.body.username;
    const password = req.body.password;
    user.findOne({ email: username }, function (err, foundUser) {
        if (foundUser) {

            bcrypt.compare(password, foundUser.password, function (err, check) {
                if (check === true) {
                    res.render("secrets");
                } else {
                    res.redirect("/login")
                }
            });


        } else {
            console.log(err);

        }
    })
})

app.get("/logout", function (req, res) {
    res.redirect("/login");
})
app.get("/home", function (req, res) {
    res.render("home");
})


app.listen(3000, function () {
    console.log("started");

});