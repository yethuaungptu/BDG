var express = require("express");
var router = express.Router();
var GSP = require("../models/GSP");
var Meditate = require("../models/Meditate");
var Abhidhamma = require("../models/Abhidhamma");
var AbhidhammaQuestion = require("../models/AbhidhammaQuestion");
var Resolution = require("../models/Resolution");
const ResolutionTable = require("../models/ResolutionTable");
var Guide = require("../models/Guide");

/* GET home page. */

router.get("/", async function (req, res, next) {
  const featuredGsp = await GSP.find({ isDeleted: false, isFeatured: true });
  const featuredMeditate = await Meditate.find({
    isDeleted: false,
    isFeatured: true,
  });
  const featuredResolution = await ResolutionTable.find({
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
  const resolutions = await ResolutionTable.find({ isDeleted: false });
  res.render("resolution", { __: res.__, resolutions: resolutions });
});

router.get("/resolution/:id", async function (req, res, next) {
  const resolution = await ResolutionTable.findById(req.params.id);
  res.render("resolutionDetail-v2", { __: res.__, resolution: resolution });
});

router.get("/dhamma", async function (req, res, next) {
  const guides = await Guide.find({ isDeleted: false }).sort({ created: -1 });
  res.render("dharma", { __: res.__, guides: guides });
});

router.get("/dhamma/detail/:id", async function (req, res, next) {
  const guide = await Guide.findById(req.params.id).populate(
    "comments.userId",
    "name avatar"
  );
  res.render("guideDetail", { __: res.__, guide: guide });
});

router.get("/abhidhamma", async function (req, res, next) {
  var query = { isDeleted: false };
  var filterValue = "";
  if (req.query.category) {
    filterValue = req.query.category;
    query = { category: filterValue, isDeleted: false };
  }
  const abhidhammas = await AbhidhammaQuestion.find(query).sort({
    created: -1,
  });

  res.render("abhidhamma", {
    __: res.__,
    abhidhammas: abhidhammas,
    filterValue: filterValue,
  });
});

router.get("/abhidhamma/:id", async function (req, res, next) {
  const abhidhamma = await AbhidhammaQuestion.findById(req.params.id);
  console.log(abhidhamma);
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
