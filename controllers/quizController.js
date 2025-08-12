var express = require("express");
var router = express.Router();
var Quiz = require("../models/Quiz");
var moment = require("moment-timezone");

router.get("/", async function (req, res) {
  const quiz = await Quiz.find().sort({ created: -1 });
  res.render("admin/quiz/index", {
    __: res.__,
    quiz: quiz,
  });
});

router.get("/create", function (req, res) {
  res.render("admin/quiz/create", { __: res.__ });
});

router.post("/create", async function (req, res) {
  try {
    const quiz = new Quiz();
    quiz.title = req.body.title;
    quiz.durationMinutes = req.body.durationMinutes;
    quiz.description = req.body.description;
    quiz.category = req.body.category;
    quiz.questions = req.body.questions ? req.body.questions : [];
    await quiz.save();
    res.redirect("/admin/quiz");
  } catch (e) {
    console.log(e);
    res.redirect("/admin/quiz/create");
  }
});

// router.get("/detail/:id", async function (req, res) {
//   try {
//     const meditate = await Meditate.findById(req.params.id);
//     res.render("admin/meditate/detail", { meditate: meditate, __: res.__ });
//   } catch (e) {
//     console.log(e);
//     res.redirect("/admin/meditate");
//   }
// });

// router.post("/delete", async function (req, res) {
//   try {
//     const update = {
//       isDeleted: true,
//       updated: moment.utc(Date.now()).tz("Asia/Yangon").format(),
//     };
//     await Meditate.findByIdAndUpdate(req.body.meditateId, { $set: update });
//     res.json({ status: "success" });
//   } catch (e) {
//     console.error("Error deleting tip:", e);
//     res.json({ status: "error" });
//   }
// });

// router.get("/update/:id", async function (req, res) {
//   try {
//     const meditate = await Meditate.findById(req.params.id);
//     res.render("admin/meditate/update", { meditate: meditate, __: res.__ });
//   } catch (e) {
//     console.log(e);
//     res.redirect("/admin/meditate");
//   }
// });

// router.post("/update", async function (req, res) {
//   try {
//     const update = {
//       title: req.body.title,
//       guider: req.body.guider,
//       level: req.body.level,
//       mediaType: req.body.mediaType,
//       mediaUrl: req.body.mediaUrl,
//       minutes: req.body.minutes,
//       seconds: req.body.seconds,
//       description: req.body.description,
//       steps: req.body.steps ? req.body.steps : [],
//       helps: req.body.helps ? req.body.helps : [],
//       updated: moment.utc(Date.now()).tz("Asia/Yangon").format(),
//     };
//     await Meditate.findByIdAndUpdate(req.body.id, { $set: update });
//     res.redirect("/admin/meditate");
//   } catch (e) {
//     console.log(e);
//     res.redirect("/admin/meditate/detail/" + req.body.id);
//   }
// });

// router.post("/feature", async function (req, res) {
//   try {
//     const update = {
//       isFeatured: req.body.isFeatured,
//       updated: moment.utc(Date.now()).tz("Asia/Yangon").format(),
//     };
//     await Meditate.findByIdAndUpdate(req.body.meditateId, { $set: update });
//     res.json({ status: "success" });
//   } catch (e) {
//     console.error("Error updating tip:", e);
//     res.json({ status: "error" });
//   }
// });

module.exports = router;
