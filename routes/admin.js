var express = require("express");
var router = express.Router();
var gspController = require("../controllers/gspController");
var meditateController = require("../controllers/meditateController");
// var abhidhammaController = require("../controllers/abhidhammaController");
var abhidhammaQuestion = require("../controllers/abhidhammaQustion");
var resolutionController = require("../controllers/resolutionController");
var guideController = require("../controllers/guideController");
var quizController = require("../controllers/quizController");

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.render("admin/index", { __: res.__ });
});

router.use("/gsp", gspController);
router.use("/meditate", meditateController);
router.use("/abhidhamma", abhidhammaQuestion);
router.use("/resolution", resolutionController);
router.use("/guide", guideController);
router.use("/quiz", quizController);
module.exports = router;
