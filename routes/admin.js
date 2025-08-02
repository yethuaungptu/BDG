var express = require("express");
var router = express.Router();
var gspController = require("../controllers/gspController");
var meditateController = require("../controllers/meditateController");
var abhidhammaController = require("../controllers/abhidhammaController");
var resolutionController = require("../controllers/resolutionController");

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.render("admin/index", { __: res.__ });
});

router.use("/gsp", gspController);
router.use("/meditate", meditateController);
router.use("/abhidhamma", abhidhammaController);
router.use("/resolution", resolutionController);
module.exports = router;
