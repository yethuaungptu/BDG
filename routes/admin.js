var express = require("express");
var router = express.Router();

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.render("admin/index", { __: res.__ });
});

module.exports = router;
