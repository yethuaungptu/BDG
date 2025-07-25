var express = require("express");
var router = express.Router();
var Abhidhamma = require("../models/Abhidhamma");
var moment = require("moment-timezone");

router.get("/", async function (req, res) {
  var query = { isDeleted: false };
  var filterValue = "";
  if (req.query.year) {
    filterValue = req.query.year;
    query = { year: filterValue, isDeleted: false };
  }
  const abhidhammas = await Abhidhamma.find(query).sort({
    created: -1,
  });
  const years = await Abhidhamma.aggregate([{ $group: { _id: "$year" } }]);
  res.render("admin/abhidhamma/index", {
    __: res.__,
    abhidhammas: abhidhammas,
    filterValue: filterValue,
    years: years,
  });
});

router.get("/create", async function (req, res) {
  res.render("admin/abhidhamma/create", { __: res.__ });
});

router.post("/create", async function (req, res) {
  try {
    const abhidhamma = new Abhidhamma();
    abhidhamma.title = req.body.title;
    abhidhamma.year = req.body.year;
    abhidhamma.description = req.body.description;
    abhidhamma.questions = req.body.questions ? req.body.questions : [];
    await abhidhamma.save();
    res.redirect("/admin/abhidhamma");
  } catch (e) {
    console.log(e);
    res.redirect("/admin/abhidhamma/create");
  }
});

router.get("/detail/:id", async function (req, res) {
  const abhidhamma = await Abhidhamma.findById(req.params.id);
  res.render("admin/abhidhamma/detail", { abhidhamma: abhidhamma });
});

router.get("/update/:id", async function (req, res) {
  const abhidhamma = await Abhidhamma.findById(req.params.id);
  res.render("admin/abhidhamma/update", { abhidhamma: abhidhamma });
});

router.post("/update", async function (req, res) {
  try {
    const update = {
      title: req.body.title,
      year: req.body.year,
      description: req.body.description,
      questions: req.body.questions ? req.body.questions : [],
      updated: moment.utc(Date.now()).tz("Asia/Yangon").format(),
    };
    await Abhidhamma.findByIdAndUpdate(req.body.id, { $set: update });
    res.redirect("/admin/abhidhamma");
  } catch (e) {
    res.redirect("/admin/abhidhamma/update/" + req.body.id);
  }
});

router.post("/delete", async function (req, res) {
  try {
    const update = {
      isDeleted: true,
      updated: moment.utc(Date.now()).tz("Asia/Yangon").format(),
    };
    await Abhidhamma.findByIdAndUpdate(req.body.abhidhammaId, { $set: update });
    res.json({ status: "success" });
  } catch (e) {
    console.error("Error deleting tip:", e);
    res.json({ status: "error" });
  }
});

module.exports = router;
