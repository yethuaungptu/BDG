var express = require("express");
var router = express.Router();

/* GET home page. */

router.get("/", function (req, res, next) {
  res.render("index", { title: "Express", __: res.__ });
});

router.get("/gsp", function (req, res, next) {
  res.render("gsp", { __: res.__ });
});

router.get("/meditate", function (req, res, next) {
  res.render("meditate", { __: res.__ });
});

router.get("/resolution", function (req, res, next) {
  res.render("resolution", { __: res.__ });
});

router.get("/dharma", function (req, res, next) {
  res.render("dharma", { __: res.__ });
});

router.get("/abhidhamma", function (req, res, next) {
  res.render("abhidhamma", { __: res.__ });
});

router.get("/login", function (req, res, next) {
  res.render("login", { __: res.__ });
});

router.get("/register", function (req, res, next) {
  res.render("register", { __: res.__ });
});

module.exports = router;
