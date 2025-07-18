var express = require("express");
var router = express.Router();
var GSP = require("../models/GSP");
var moment = require("moment-timezone");

router.get("/", async function (req, res) {
  var query = { isDeleted: false };
  var filterValue = "";
  if (req.query.search) {
    filterValue = req.query.search;
    query = { category: filterValue, isDeleted: false };
  }
  const gsps = await GSP.find(query).sort({ created: -1 });
  res.render("admin/gsp/index", {
    __: res.__,
    gsps: gsps,
    filterValue: filterValue,
  });
});

router.get("/create", function (req, res) {
  res.render("admin/gsp/create", { __: res.__ });
});

router.post("/create", async function (req, res) {
  try {
    const gsp = new GSP();
    gsp.titleEN = req.body.titleEN ? req.body.titleEN : "";
    gsp.titleMM = req.body.titleMM;
    gsp.mmContent = req.body.mmContent;
    gsp.enContent = req.body.enContent ? req.body.enContent : "";
    gsp.category = req.body.category;
    await gsp.save();
    res.redirect("/admin/gsp");
  } catch (e) {
    console.log(e);
    res.redirect("/admin/gsp/create");
  }
});

router.get("/detail/:id", async function (req, res) {
  try {
    const gsp = await GSP.findById(req.params.id);
    res.render("admin/gsp/detail", { gsp: gsp, __: res.__ });
  } catch (e) {
    console.log(e);
    res.redirect("/admin/gsp");
  }
});

router.post("/delete", async function (req, res) {
  try {
    const update = {
      isDeleted: true,
      updated: moment.utc(Date.now()).tz("Asia/Yangon").format(),
    };
    await GSP.findByIdAndUpdate(req.body.gspId, { $set: update });
    res.json({ status: "success" });
  } catch (e) {
    console.error("Error deleting tip:", e);
    res.json({ status: "error" });
  }
});

router.get("/update/:id", async function (req, res) {
  try {
    const gsp = await GSP.findById(req.params.id);
    res.render("admin/gsp/update", { gsp: gsp, __: res.__ });
  } catch (e) {
    console.log(e);
    res.redirect("/admin/gsp");
  }
});

router.post("/update", async function (req, res) {
  try {
    const update = {
      titleEN: req.body.titleEN ? req.body.titleEN : "",
      titleMM: req.body.titleMM,
      mmContent: req.body.mmContent,
      enContent: req.body.enContent ? req.body.enContent : "",
      category: req.body.category,
      updated: moment.utc(Date.now()).tz("Asia/Yangon").format(),
    };
    await GSP.findByIdAndUpdate(req.body.id, { $set: update });
    res.redirect("/admin/gsp");
  } catch (e) {
    console.log(e);
    res.redirect("/admin/gsp/detail/" + req.body.id);
  }
});

router.post("/feature", async function (req, res) {
  try {
    const update = {
      isFeatured: req.body.isFeatured,
      updated: moment.utc(Date.now()).tz("Asia/Yangon").format(),
    };
    await GSP.findByIdAndUpdate(req.body.gspId, { $set: update });
    res.json({ status: "success" });
  } catch (e) {
    console.error("Error updating tip:", e);
    res.json({ status: "error" });
  }
});

module.exports = router;
