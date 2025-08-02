var express = require("express");
var router = express.Router();
var GSP = require("../models/GSP");
var Meditate = require("../models/Meditate");
var Abhidhamma = require("../models/Abhidhamma");
var Resolution = require("../models/Resolution");

/* GET home page. */

router.get("/", async function (req, res, next) {
  const featuredGsp = await GSP.find({ isDeleted: false, isFeatured: true });
  const featuredMeditate = await Meditate.find({
    isDeleted: false,
    isFeatured: true,
  });
  const featuredResolution = await Resolution.find({
    isDeleted: false,
    isFeatured: true,
  });
  res.render("index", {
    title: "Express",
    __: res.__,
    featuredGsp: featuredGsp,
    featuredMeditate: featuredMeditate,
    featuredResolution: featuredResolution,
  });
});

router.get("/gsp", async function (req, res, next) {
  const gsps = await GSP.find({ isDeleted: false }).sort({ created: -1 });
  res.render("gsp", { __: res.__, gsps: gsps });
});

router.get("/gsp/detail/:id", async function (req, res, next) {
  try {
    const gsp = await GSP.findById(req.params.id);
    res.render("gspDetail", { __: res.__, gsp: gsp });
  } catch (e) {
    res.redirect("/gsp");
  }
});

router.get("/meditate", async function (req, res, next) {
  const meditates = await Meditate.find({ isDeleted: false }).sort({
    created: -1,
  });
  res.render("meditate", { __: res.__, meditates: meditates });
});

router.get("/meditate/detail/:id", async function (req, res, next) {
  try {
    const meditate = await Meditate.findById(req.params.id);
    res.render("meditateDetail", { __: res.__, meditate: meditate });
  } catch (e) {
    res.redirect("/meditate");
  }
});

router.get("/resolution", async function (req, res, next) {
  const resolutions = await Resolution.find({ isDeleted: false });
  res.render("resolution", { __: res.__, resolutions: resolutions });
});

router.get("/resolution/:id", async function (req, res, next) {
  const resolution = await Resolution.findById(req.params.id);
  res.render("resolutionDetail", { __: res.__, resolution: resolution });
});

router.get("/dharma", function (req, res, next) {
  res.render("dharma", { __: res.__ });
});

router.get("/abhidhamma", async function (req, res, next) {
  const abhidhammas = await Abhidhamma.find({ isDeleted: false }).sort({
    created: -1,
  });
  res.render("abhidhamma", { __: res.__, abhidhammas: abhidhammas });
});

router.get("/abhidhamma/:id", async function (req, res, next) {
  const abhidhamma = await Abhidhamma.findById(req.params.id);
  res.render("abhidhammaDetail", { __: res.__, abhidhamma: abhidhamma });
});

router.get("/login", function (req, res, next) {
  res.render("login", { __: res.__ });
});

router.get("/register", function (req, res, next) {
  res.render("register", { __: res.__ });
});

router.get("/adminLogin", function (req, res) {
  res.render("adminLogin", { error: req.query.error ? req.query.error : null });
});

router.post("/adminLogin", (req, res) => {
  console.log(req.body);
  if (
    req.body.email === "bdg@admin.com" &&
    req.body.password === "bdgadmin2025"
  ) {
    req.session.admin = {
      email: req.body.email,
    };
    res.redirect("/admin");
  } else {
    res.redirect("/adminLogin?error=Invalid credentials");
  }
});
module.exports = router;
