var express = require("express");
var router = express.Router();
var Guide = require("../models/Guide");
var moment = require("moment-timezone");

router.get("/", async function (req, res) {
  const guides = await Guide.find({ isDeleted: false }).sort({ created: -1 });
  res.render("admin/guide/index", {
    __: res.__,
    guides: guides,
  });
});

router.get("/create", function (req, res) {
  res.render("admin/guide/create", { __: res.__ });
});

router.post("/create", async function (req, res) {
  try {
    const guide = new Guide();
    guide.title = req.body.title;
    guide.summary = req.body.summary;
    guide.mediaUrl = req.body.mediaUrl;
    await guide.save();
    res.redirect("/admin/guide");
  } catch (e) {
    console.log(e);
    res.redirect("/admin/guide/create");
  }
});

router.get("/detail/:id", async function (req, res) {
  try {
    const guide = await Guide.findById(req.params.id);
    res.render("admin/guide/detail", { guide: guide, __: res.__ });
  } catch (e) {
    console.log(e);
    res.redirect("/admin/guide");
  }
});

router.post("/delete", async function (req, res) {
  try {
    const update = {
      isDeleted: true,
      updated: moment.utc(Date.now()).tz("Asia/Yangon").format(),
    };
    await Guide.findByIdAndUpdate(req.body.guideId, { $set: update });
    res.json({ status: "success" });
  } catch (e) {
    console.error("Error deleting tip:", e);
    res.json({ status: "error" });
  }
});

router.get("/update/:id", async function (req, res) {
  try {
    const guide = await Guide.findById(req.params.id);
    res.render("admin/guide/update", { guide: guide, __: res.__ });
  } catch (e) {
    console.log(e);
    res.redirect("/admin/guide");
  }
});

router.post("/update", async function (req, res) {
  try {
    const update = {
      title: req.body.title,
      summary: req.body.summary,
      mediaUrl: req.body.mediaUrl,
      updated: moment.utc(Date.now()).tz("Asia/Yangon").format(),
    };
    await Guide.findByIdAndUpdate(req.body.id, { $set: update });
    res.redirect("/admin/guide");
  } catch (e) {
    console.log(e);
    res.redirect("/admin/guide/detail/" + req.body.id);
  }
});

router.post("/feature", async function (req, res) {
  try {
    const update = {
      isFeatured: req.body.isFeatured,
      updated: moment.utc(Date.now()).tz("Asia/Yangon").format(),
    };
    await Guide.findByIdAndUpdate(req.body.guideId, { $set: update });
    res.json({ status: "success" });
  } catch (e) {
    console.error("Error updating tip:", e);
    res.json({ status: "error" });
  }
});

module.exports = router;
