var express = require("express");
var router = express.Router();
var gspController = require("../controllers/gspController");
var meditateController = require("../controllers/meditateController");
// var abhidhammaController = require("../controllers/abhidhammaController");
var abhidhammaQuestion = require("../controllers/abhidhammaQustion");
var resolutionController = require("../controllers/resolutionController");
var guideController = require("../controllers/guideController");
var quizController = require("../controllers/quizController");

var abhidhammaQuestionModel = require("../models/AbhidhammaQuestion");
var GSP = require("../models/GSP");
var Guide = require("../models/Guide");
var Meditate = require("../models/Meditate");
var Quiz = require("../models/Quiz");
var ResolutionTable = require("../models/ResolutionTable");
var User = require("../models/User");
var TakenQuiz = require("../models/TakenQuiz");

const checkAdmin = function (req, res, next) {
  if (req.session.admin) {
    next();
  } else {
    res.redirect("/adminLogin");
  }
};

/* GET users listing. */
router.get("/", checkAdmin, async function (req, res, next) {
  const ABCount = await abhidhammaQuestionModel.countDocuments({
    isDeleted: false,
  });
  const GSPCount = await GSP.countDocuments({ isDeleted: false });
  const GuideCount = await Guide.countDocuments({ isDeleted: false });
  const MeditateCount = await Meditate.countDocuments({ isDeleted: false });
  const QuizCount = await Quiz.countDocuments({ isDeleted: false });
  const RECount = await ResolutionTable.countDocuments({ isDeleted: false });
  const UserCount = await User.countDocuments();
  const TakenQuizCount = await TakenQuiz.countDocuments();
  res.render("admin/index", {
    __: res.__,
    ABCount: ABCount,
    GSPCount: GSPCount,
    GuideCount: GuideCount,
    MeditateCount: MeditateCount,
    QuizCount: QuizCount,
    RECount: RECount,
    UserCount: UserCount,
    TakenQuizCount: TakenQuizCount,
  });
});

router.get("/logout", checkAdmin, function (req, res, next) {
  req.session.destroy();
  res.redirect("/");
});

router.use("/gsp", checkAdmin, gspController);
router.use("/meditate", checkAdmin, meditateController);
router.use("/abhidhamma", checkAdmin, abhidhammaQuestion);
router.use("/resolution", checkAdmin, resolutionController);
router.use("/guide", checkAdmin, guideController);
router.use("/quiz", checkAdmin, quizController);
module.exports = router;
