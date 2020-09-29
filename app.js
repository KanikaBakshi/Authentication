//jshint esversion:6

require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const app = express();
const encrypt= require("mongoose-encryption");

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/userDB", { useNewUrlParser: true });

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});


userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ["password"] });


const User = new mongoose.model("User", userSchema);


app.get("/home", function (req, res) {
    res.render("home");
});


app.route("/login")
    .get(function (req, res) {
        res.render("login");
    })
    .post(function (req, res) {
        User.findOne(
            {
                email: req.body.username,
            },
            function (err, foundItems) {
                if (!err && foundItems != null) {
                    if (foundItems.password === req.body.password) {
                        res.render("secrets");
                    }
                    else {
                        res.render("login");
                    }
                }
                else if (err) {
                    console.log(err);
                }
                else {
                    res.render("login");
                }
            });
    });

app.route("/register")
    .get(function (req, res) {
        res.render("register");
    })

    .post(function (req, res) {

        const newUser = new User({
            email: req.body.username,
            password: req.body.password
        });

        newUser.save(function (err) {
            if (err) {
                console.log(err);
            }
            else {
                res.render("secrets");
            }
        });
    });








app.listen(3000, function () {
    console.log("Server started on port 3000");
});
