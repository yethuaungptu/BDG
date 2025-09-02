var express = require("express");
var router = express.Router();
var multer = require("multer");
var moment = require("moment-timezone");
const fs = require("fs");
var Resolution = require("../models/Resolution");
var ResolutionTable = require("../models/ResolutionTable");
const upload = multer({ dest: "public/images/uploads" });

router.get("/", async function (req, res) {
  const resolutions = await ResolutionTable.find({ isDeleted: false }).sort({
    created: -1,
  });
  res.render("admin/resolution", { resolutions: resolutions });
});

router.get("/create", async function (req, res) {
  res.render("admin/resolution/create-v2");
});

// router.post("/create-old", upload.single("image"), async function (req, res) {
//   try {
//     const resolution = new Resolution();
//     resolution.titleMM = req.body.titleMM;
//     resolution.titleEN = req.body.titleEN;
//     resolution.contentMM = req.body.mmContent;
//     resolution.contentEN = req.body.enContent;
//     resolution.startDay = req.body.startDays;
//     resolution.durationDays = req.body.durationDays;
//     resolution.remark = req.body.remark;
//     resolution.steps = req.body.steps ? req.body.steps : [];
//     resolution.dailyTasks = req.body.daily ? req.body.daily : [];
//     if (req.file) resolution.image = "/images/uploads/" + req.file.filename;
//     await resolution.save();
//     res.redirect("/admin/resolution");
//   } catch (e) {
//     console.log(e);
//     res.redirect("/admin/resolution/create");
//   }
// });

router.post("/create", upload.single("image"), async function (req, res) {
  try {
    const resolution = new ResolutionTable();
    if (req.body.table) {
      req.body.table = req.body.table.map((row) => {
        return {
          ...row,
          colData: row.colData.map((col) => ({
            ...col,
            isSpecial: col.isSpecial === "on" ? true : false,
          })),
        };
      });
    }
    resolution.titleMM = req.body.titleMM;
    resolution.titleEN = req.body.titleEN;
    resolution.contentMM = req.body.contentMM;
    resolution.contentEN = req.body.contentEN;
    resolution.startDay = req.body.startDay;
    resolution.durationDays = req.body.durationDays;
    resolution.remark = req.body.remark;
    resolution.steps = req.body.steps ? req.body.steps : [];
    resolution.table = req.body.table ? req.body.table : [];
    if (req.file) resolution.image = "/images/uploads/" + req.file.filename;
    await resolution.save();
    res.redirect("/admin/resolution");
  } catch (e) {
    console.log(e);
    res.redirect("/admin/resolution/create");
  }
});

// router.get("/detail-old/:id", async function (req, res) {
//   const resolution = await Resolution.findById(req.params.id);
//   res.render("admin/resolution/detail", { resolution: resolution });
// });

router.get("/detail/:id", async function (req, res) {
  const resolution = await ResolutionTable.findById(req.params.id);
  res.render("admin/resolution/detail-v2", { resolution: resolution });
});

// router.get("/update-old/:id", async function (req, res) {
//   const resolution = await Resolution.findById(req.params.id);
//   res.render("admin/resolution/update", { resolution: resolution });
// });

router.get("/update/:id", async function (req, res) {
  const resolution = await ResolutionTable.findById(req.params.id);
  res.render("admin/resolution/update-v2", { resolution: resolution });
});

// router.post("/update-old", upload.single("image"), async function (req, res) {
//   try {
//     const resData = await Resolution.findById(req.body.id);
//     const update = {
//       titleMM: req.body.titleMM,
//       titleEN: req.body.titleEN,
//       contentMM: req.body.mmContent,
//       contentEN: req.body.enContent,
//       startDay: req.body.startDays,
//       durationDays: req.body.durationDays,
//       remark: req.body.remark,
//       steps: req.body.steps ? req.body.steps : [],
//       dailyTasks: req.body.daily ? req.body.daily : [],
//     };
//     if (req.file) {
//       try {
//         if (resData.image) fs.unlinkSync("public" + resData.image);
//         update.image = "/images/uploads/" + req.file.filename;
//       } catch (e) {
//         console.log("Image error");
//       }
//     }
//     await Resolution.findByIdAndUpdate(req.body.id, { $set: update });
//     res.redirect("/admin/resolution");
//   } catch (e) {
//     console.log(e);
//     res.redirect("/admin/resolution/detail/" + req.body.id);
//   }
// });

router.post("/update", upload.single("image"), async function (req, res) {
  try {
    const resData = await ResolutionTable.findById(req.body.id);
    if (req.body.table) {
      req.body.table = req.body.table.map((row) => {
        return {
          ...row,
          colData: row.colData.map((col) => ({
            ...col,
            isSpecial: col.isSpecial === "on" ? true : false,
          })),
        };
      });
    }
    const update = {
      titleMM: req.body.titleMM,
      titleEN: req.body.titleEN,
      contentMM: req.body.contentMM,
      contentEN: req.body.contentEN,
      startDay: req.body.startDay,
      durationDays: req.body.durationDays,
      remark: req.body.remark,
      steps: req.body.steps ? req.body.steps : [],
      table: req.body.table ? req.body.table : [],
    };
    if (req.file) {
      try {
        if (resData.image) fs.unlinkSync("public" + resData.image);
        update.image = "/images/uploads/" + req.file.filename;
      } catch (e) {
        console.log("Image error");
      }
    }
    await ResolutionTable.findByIdAndUpdate(req.body.id, { $set: update });
    res.redirect("/admin/resolution");
  } catch (e) {
    console.log(e);
    res.redirect("/admin/resolution/detail/" + req.body.id);
  }
});

// router.post("/feature-old", async function (req, res) {
//   try {
//     const update = {
//       isFeatured: req.body.isFeatured,
//       updated: moment.utc(Date.now()).tz("Asia/Yangon").format(),
//     };
//     await Resolution.findByIdAndUpdate(req.body.resolutionId, { $set: update });
//     res.json({ status: "success" });
//   } catch (e) {
//     console.error("Error updating tip:", e);
//     res.json({ status: "error" });
//   }
// });

router.post("/feature", async function (req, res) {
  try {
    const update = {
      isFeatured: req.body.isFeatured,
      updated: moment.utc(Date.now()).tz("Asia/Yangon").format(),
    };
    await ResolutionTable.findByIdAndUpdate(req.body.resolutionId, {
      $set: update,
    });
    res.json({ status: "success" });
  } catch (e) {
    console.error("Error updating tip:", e);
    res.json({ status: "error" });
  }
});

// router.post("/delete-old", async function (req, res) {
//   try {
//     const update = {
//       isDeleted: true,
//       updated: moment.utc(Date.now()).tz("Asia/Yangon").format(),
//     };
//     await Resolution.findByIdAndUpdate(req.body.resolutionId, { $set: update });
//     res.json({ status: "success" });
//   } catch (e) {
//     console.error("Error deleting tip:", e);
//     res.json({ status: "error" });
//   }
//});

router.post("/delete", async function (req, res) {
  try {
    const update = {
      isDeleted: true,
      updated: moment.utc(Date.now()).tz("Asia/Yangon").format(),
    };
    await ResolutionTable.findByIdAndUpdate(req.body.resolutionId, {
      $set: update,
    });
    res.json({ status: "success" });
  } catch (e) {
    console.error("Error deleting tip:", e);
    res.json({ status: "error" });
  }
});

module.exports = router;
