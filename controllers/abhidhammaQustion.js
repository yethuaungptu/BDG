var express = require("express");
var router = express.Router();
var multer = require("multer");
const fs = require("fs");
const upload = multer({ dest: "public/pdf/uploads" });
var AbhidhammaQuestion = require("../models/AbhidhammaQuestion");
var moment = require("moment-timezone");

router.get("/", async function (req, res) {
  var query = { isDeleted: false };
  var filterValue = "";
  if (req.query.category) {
    filterValue = req.query.category;
    query = { category: filterValue, isDeleted: false };
  }
  const abhidhammas = await AbhidhammaQuestion.find(query).sort({
    created: -1,
  });
  res.render("admin/abhidhammaQuestion/index", {
    __: res.__,
    abhidhammas: abhidhammas,
    filterValue: filterValue,
  });
});

router.get("/create", async function (req, res) {
  res.render("admin/abhidhammaQuestion/create", { __: res.__ });
});

router.post("/create", upload.single("pdfFile"), async function (req, res) {
  try {
    const abhidhamma = new AbhidhammaQuestion();
    abhidhamma.title = req.body.title;
    abhidhamma.category = req.body.category;
    abhidhamma.description = req.body.description;
    if (req.file) abhidhamma.pdfFilePath = "/pdf/uploads/" + req.file.filename;
    await abhidhamma.save();
    res.redirect("/admin/abhidhamma");
  } catch (e) {
    console.log(e);
    res.redirect("/admin/abhidhamma/create");
  }
});

router.get("/detail/:id", async function (req, res) {
  const abhidhamma = await AbhidhammaQuestion.findById(req.params.id);
  res.render("admin/abhidhammaQuestion/detail", { abhidhamma: abhidhamma });
});

router.get("/update/:id", async function (req, res) {
  const abhidhamma = await AbhidhammaQuestion.findById(req.params.id);
  res.render("admin/abhidhammaQuestion/update", { abhidhamma: abhidhamma });
});

router.post("/update", upload.single("pdfFile"), async function (req, res) {
  try {
    const abhidhammaData = await AbhidhammaQuestion.findById(req.body.id);
    const update = {
      title: req.body.title,
      year: req.body.year,
      description: req.body.description,
      updated: moment.utc(Date.now()).tz("Asia/Yangon").format(),
    };
    if (req.file) {
      try {
        if (abhidhammaData.pdfFilePath)
          fs.unlinkSync("public" + abhidhammaData.pdfFilePath);
        update.pdfFilePath = "/pdf/uploads/" + req.file.filename;
      } catch (e) {
        console.log("pdfFilePath error");
      }
    }
    await AbhidhammaQuestion.findByIdAndUpdate(req.body.id, { $set: update });
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
    await AbhidhammaQuestion.findByIdAndUpdate(req.body.abhidhammaId, {
      $set: update,
    });
    res.json({ status: "success" });
  } catch (e) {
    console.error("Error deleting tip:", e);
    res.json({ status: "error" });
  }
});

module.exports = router;
