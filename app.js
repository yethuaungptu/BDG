require("dotenv").config();
const flash = require("connect-flash");
var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var session = require("express-session");
var mongoose = require("mongoose");
const i18n = require("i18n");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var adminRouter = require("./routes/admin");

const passport = require("./config/passport");
const { router: authRoutes, isAuthenticated } = require("./routes/auth");

var app = express();

i18n.configure({
  locales: ["en", "mm"],
  directory: path.join(__dirname, "locales"),
  defaultLocale: "mm",
  queryParameter: "lang",
  autoReload: true,
  syncFiles: false,
  objectNotation: true,
});

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

mongoose.connect("mongodb://127.0.0.1/bdgdb");
const db = mongoose.connection;
db.on("error", console.error.bind("mongodb connection error at bdgdb"));

app.use(
  session({
    secret: "PyayCU@BDG2025",
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

app.use(i18n.init);

app.use((req, res, next) => {
  // If lang is passed in query, update session locale
  if (req.query.lang) {
    req.setLocale(req.query.lang);
    req.session.locale = req.query.lang;
  } else if (req.session.locale) {
    req.setLocale(req.session.locale);
  }
  res.locals.lang = req.getLocale();
  res.locals.isAuthenticated = req.isAuthenticated
    ? req.isAuthenticated()
    : false;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.user = req.user;
  res.locals.admin = req.session.admin;
  next();
});

app.use("/", indexRouter);
app.use("/auth", authRoutes);
app.use("/user", isAuthenticated, usersRouter);
app.use("/admin", adminRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
