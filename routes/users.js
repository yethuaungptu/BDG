var express = require("express");
var router = express.Router();
var User = require("../models/User");
var Guide = require("../models/Guide");
var TakeQuiz = require("../models/TakenQuiz");
var Quiz = require("../models/Quiz");
var ResolutionTable = require("../models/ResolutionTable");
const { google } = require("googleapis");
var moment = require("moment-timezone");

/* GET users listing. */
router.get("/", async function (req, res, next) {
  const user = await User.findById(req.user._id);
  const guide = await Guide.aggregate([
    {
      $facet: {
        totalCounts: [
          {
            $group: {
              _id: null,
              currentUserTotalLikeCount: {
                $sum: {
                  $cond: [{ $in: [user._id, "$likes"] }, 1, 0],
                },
              },
              currentUserTotalCommentCount: {
                $sum: {
                  $size: {
                    $filter: {
                      input: "$comments",
                      as: "c",
                      cond: { $eq: ["$$c.userId", user._id] },
                    },
                  },
                },
              },
            },
          },
        ],
        recentComment: [
          { $unwind: "$comments" },
          { $match: { "comments.userId": user._id } },
          { $sort: { "comments.created": -1 } },
          { $limit: 1 },
          { $replaceRoot: { newRoot: "$comments" } },
        ],
      },
    },
    {
      $project: {
        currentUserTotalLikeCount: {
          $arrayElemAt: ["$totalCounts.currentUserTotalLikeCount", 0],
        },
        currentUserTotalCommentCount: {
          $arrayElemAt: ["$totalCounts.currentUserTotalCommentCount", 0],
        },
        currentUserRecentComment: "$recentComment",
      },
    },
  ]);
  console.log(guide);
  res.render("user/index", { user: user, guide: guide });
});

router.get("/myResolution", async function (req, res) {
  const history = await User.findById(req.user._id)
    .populate("resolutionList.id")
    .lean();

  history.resolutionList.sort(
    (a, b) => new Date(b.created) - new Date(a.created)
  );
  res.render("user/myResolution", { history: history });
});

router.post("/guideLikeFeature", async (req, res) => {
  try {
    console.log(req.body);
    if (req.body.action == "like") {
      await Guide.findByIdAndUpdate(req.body.guideId, {
        $push: { likes: req.user._id },
      });
    } else {
      await Guide.findByIdAndUpdate(
        req.body.guideId,
        {
          $pull: { likes: req.user._id },
        },
        { new: true }
      );
    }
    res.json({ status: true, message: "Guide like change success" });
  } catch (e) {
    console.log(e);
    res.json({
      status: false,
      message: "Somethings was wrong",
    });
  }
});

router.post("/guideCommentFeature", async (req, res) => {
  try {
    const guide = await Guide.findById(req.body.guideId);
    if (!guide) {
      return res.json({ status: false, message: "Guide not found" });
    }
    const newComment = {
      userId: req.user._id,
      content: req.body.comment,
      created: moment.utc(Date.now()).tz("Asia/Yangon").format(),
    };
    await Guide.findByIdAndUpdate(req.body.guideId, {
      $push: { comments: newComment },
    });
    res.json({ status: true, message: "Comment added successfully" });
  } catch (e) {
    console.log(e);
    res.json({
      status: false,
      message: "Somethings was wrong",
    });
  }
});

router.post("/joinResolution", async function (req, res) {
  try {
    const resolution = await ResolutionTable.findById(req.body.id);
    const user = await User.findById(req.user._id);
    console.log(user);
    if (!resolution || !user) {
      return res.json({
        status: false,
        message: "Resolution or User not found",
      });
    }
    if (user.googleAccessToken && user.googleRefreshToken) {
      await addEventToGoogleCalendar(user, resolution);
    }
    const newResolution = {
      id: req.body.id,
      created: moment.utc(Date.now()).tz("Asia/Yangon").format(),
    };
    await User.findByIdAndUpdate(user._id, {
      $push: { resolutionList: newResolution },
    });
    res.json({ status: true, message: "Resolution added successfully" });
  } catch (e) {
    console.log(e);
    res.json({
      status: false,
      message: "Somethings was wrong",
    });
  }
});

router.get("/quizList", async function (req, res) {
  try {
    const myQuizHistory = await TakeQuiz.find({ user: req.user._id })
      .populate("quiz")
      .sort({ created: -1 });
    const takenQuizIds = myQuizHistory.map((q) => q.quiz._id);
    const quizzes = await Quiz.find({
      isDeleted: false,
      _id: { $nin: takenQuizIds },
    }).sort({ created: -1 });
    res.render("user/quizList", {
      myQuizHistory: myQuizHistory,
      quizzes: quizzes,
    });
  } catch (e) {
    console.log(e);
    res.redirect("/user");
  }
});

router.get("/quizDetail/:id", async function (req, res) {
  try {
    let correctAnswers = 0;
    const takenQuiz = await TakeQuiz.findById(req.params.id).populate("quiz");
    takenQuiz.answers.forEach((answer) => {
      if (answer.isCorrect) {
        correctAnswers++;
      }
    });
    res.render("user/quizDetail", {
      takenQuiz: takenQuiz,
      correctAnswers: correctAnswers,
    });
  } catch (e) {
    console.log(e);
    res.redirect("/user");
  }
});

router.get("/takeQuiz/:id", async function (req, res) {
  try {
    const quizDetail = await Quiz.findById(req.params.id);
    res.render("user/takeQuiz", { quizDetail: quizDetail });
  } catch (e) {
    console.log(e);
    res.redirect("/user");
  }
});

router.post("/answerQuiz", async function (req, res) {
  try {
    const takenQuiz = new TakeQuiz();
    takenQuiz.user = req.user.id;
    takenQuiz.quiz = req.body.quizId;
    takenQuiz.answers = req.body.answers ? req.body.answers : [];
    takenQuiz.totalScore = req.body.totalScore;
    takenQuiz.durationTaken = req.body.durationTaken;
    await takenQuiz.save();
    res.json({ status: true });
  } catch (e) {
    console.log(e);
    res.json({ status: false });
  }
});

async function addEventToGoogleCalendar(user, resolution) {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
  );

  oauth2Client.setCredentials({
    access_token: user.googleAccessToken,
    refresh_token: user.googleRefreshToken,
  });

  const calendar = google.calendar({ version: "v3", auth: oauth2Client });

  const startDateTime = new Date(Date.now());
  const endDateTime = new Date(startDateTime);
  endDateTime.setDate(startDateTime.getDate() + resolution.durationDays - 1);
  await calendar.events.insert({
    calendarId: "primary",
    requestBody: {
      summary: resolution.titleEN,
      description: resolution.contentEN,
      start: { dateTime: startDateTime, timeZone: "Asia/Yangon" },
      end: { dateTime: endDateTime, timeZone: "Asia/Yangon" },
      reminders: {
        useDefault: false,
        overrides: [
          { method: "popup", minutes: 30 },
          { method: "email", minutes: 1440 },
        ],
      },
    },
  });
}

module.exports = router;
