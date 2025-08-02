var express = require("express");
var router = express.Router();
var multer = require("multer");
var moment = require("moment-timezone");
const fs = require("fs");
var Resolution = require("../models/Resolution");
const upload = multer({ dest: "public/images/uploads" });

router.get("/", async function (req, res) {
  const resolutions = await Resolution.find({ isDeleted: false });
  res.render("admin/resolution", { resolutions: resolutions });
});

router.get("/create", async function (req, res) {
  res.render("admin/resolution/create");
});

router.post("/create", upload.single("image"), async function (req, res) {
  try {
    const resolution = new Resolution();
    resolution.titleMM = req.body.titleMM;
    resolution.titleEN = req.body.titleEN;
    resolution.contentMM = req.body.mmContent;
    resolution.contentEN = req.body.enContent;
    resolution.startDay = req.body.startDays;
    resolution.durationDays = req.body.durationDays;
    resolution.remark = req.body.remark;
    resolution.steps = req.body.steps ? req.body.steps : [];
    resolution.dailyTasks = req.body.daily ? req.body.daily : [];
    if (req.file) resolution.image = "/images/uploads/" + req.file.filename;
    await resolution.save();
    res.redirect("/admin/resolution");
  } catch (e) {
    console.log(e);
    res.redirect("/admin/resolution/create");
  }
});

router.get("/detail/:id", async function (req, res) {
  const resolution = await Resolution.findById(req.params.id);
  res.render("admin/resolution/detail", { resolution: resolution });
});

router.get("/update/:id", async function (req, res) {
  const resolution = await Resolution.findById(req.params.id);
  res.render("admin/resolution/update", { resolution: resolution });
});

router.post("/update", upload.single("image"), async function (req, res) {
  try {
    const resData = await Resolution.findById(req.body.id);
    const update = {
      titleMM: req.body.titleMM,
      titleEN: req.body.titleEN,
      contentMM: req.body.mmContent,
      contentEN: req.body.enContent,
      startDay: req.body.startDays,
      durationDays: req.body.durationDays,
      remark: req.body.remark,
      steps: req.body.steps ? req.body.steps : [],
      dailyTasks: req.body.daily ? req.body.daily : [],
    };
    if (req.file) {
      try {
        if (resData.image) fs.unlinkSync("public" + resData.image);
        update.image = "/images/uploads/" + req.file.filename;
      } catch (e) {
        console.log("Image error");
      }
    }
    await Resolution.findByIdAndUpdate(req.body.id, { $set: update });
    res.redirect("/admin/resolution");
  } catch (e) {
    console.log(e);
    res.redirect("/admin/resolution/detail/" + req.body.id);
  }
});

router.post("/feature", async function (req, res) {
  try {
    const update = {
      isFeatured: req.body.isFeatured,
      updated: moment.utc(Date.now()).tz("Asia/Yangon").format(),
    };
    await Resolution.findByIdAndUpdate(req.body.resolutionId, { $set: update });
    res.json({ status: "success" });
  } catch (e) {
    console.error("Error updating tip:", e);
    res.json({ status: "error" });
  }
});

router.post("/delete", async function (req, res) {
  try {
    const update = {
      isDeleted: true,
      updated: moment.utc(Date.now()).tz("Asia/Yangon").format(),
    };
    await Resolution.findByIdAndUpdate(req.body.resolutionId, { $set: update });
    res.json({ status: "success" });
  } catch (e) {
    console.error("Error deleting tip:", e);
    res.json({ status: "error" });
  }
});

module.exports = router;
