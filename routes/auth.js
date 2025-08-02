const express = require("express");
const passport = require("passport");
const User = require("../models/User");
const router = express.Router();

// Middleware to check if user is authenticated
const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/auth/login");
};

// Middleware to redirect if already logged in
const redirectIfAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return res.redirect("/dashboard");
  }
  next();
};
router.get("/login", redirectIfAuthenticated, (req, res) => {
  res.render("auth/login", {
    title: "Login",
    messages: req.flash(),
  });
});

// GET register page
router.get("/register", redirectIfAuthenticated, (req, res) => {
  res.render("auth/register", {
    title: "Register",
    messages: req.flash(),
  });
});

// POST register
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    // Validation
    if (!name || !email || !password || !confirmPassword) {
      req.flash("error", "All fields are required");
      return res.redirect("/auth/register");
    }

    if (password !== confirmPassword) {
      req.flash("error", "Passwords do not match");
      return res.redirect("/auth/register");
    }

    if (password.length < 6) {
      req.flash("error", "Password must be at least 6 characters");
      return res.redirect("/auth/register");
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      req.flash("error", "User already exists with this email");
      return res.redirect("/auth/register");
    }

    // Create new user
    const user = new User({
      name,
      email,
      password,
    });

    await user.save();

    req.flash("success", "Registration successful! Please login.");
    res.redirect("/auth/login");
  } catch (error) {
    console.error("Registration error:", error);
    req.flash("error", "Registration failed. Please try again.");
    res.redirect("/auth/register");
  }
});

// POST login
router.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      console.error("Login error:", err);
      req.flash("error", "Login failed. Please try again.");
      return res.redirect("/auth/login");
    }

    if (!user) {
      req.flash("error", info.message || "Invalid credentials");
      return res.redirect("/auth/login");
    }

    req.logIn(user, (err) => {
      if (err) {
        console.error("Login error:", err);
        req.flash("error", "Login failed. Please try again.");
        return res.redirect("/auth/login");
      }

      req.flash("success", `Welcome back, ${user.name}!`);
      return res.redirect("/dashboard");
    });
  })(req, res, next);
});

// Google OAuth routes
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/auth/login" }),
  (req, res) => {
    req.flash("success", `Welcome, ${req.user.name}!`);
    res.redirect("/dashboard");
  }
);

// Logout
router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error("Logout error:", err);
    }
    req.flash("success", "You have been logged out successfully");
    res.redirect("/");
  });
});

module.exports = { router, isAuthenticated };
