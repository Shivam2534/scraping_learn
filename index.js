const express = require("express");
const passport = require("passport");
const LinkedInStrategy = require("passport-linkedin-oauth2").Strategy;
const session = require("express-session");
const axios = require("axios");
require("dotenv").config();

const app = express();

// Session middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
  })
);

// Initialize passport
app.use(passport.initialize());
app.use(passport.session());

// Serialize user
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

// LinkedIn OAuth Strategy
passport.use(
  new LinkedInStrategy(
    {
      clientID: process.env.LINKEDIN_CLIENT_ID,
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
      callbackURL: process.env.LINKEDIN_CALLBACK_URL,
      scope: ["r_liteprofile"],
      state: true,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Store the access token for later use
        profile.accessToken = accessToken;
        return done(null, profile);
      } catch (error) {
        console.error('LinkedIn Strategy Error:', error);
        return done(error, null);
      }
    }
  )
);

// Routes
app.get("/", (req, res) => {
  res.send(`
    <h1>LinkedIn Authentication</h1>
    <p>Make sure you have configured your LinkedIn application with proper scopes.</p>
    <a href="/auth/linkedin">Login with LinkedIn</a>
  `);
});

app.get("/auth/linkedin", (req, res, next) => {
  passport.authenticate("linkedin", (err) => {
    if (err) {
      console.error('Authentication Error:', err);
      if (err.code === 'unauthorized_scope_error') {
        return res.redirect('/error?message=' + encodeURIComponent(
          'LinkedIn application is not properly configured. Please go to LinkedIn Developer Console (https://www.linkedin.com/developers/apps), select your app, go to Auth tab, and add the r_liteprofile scope under OAuth 2.0 scopes.'
        ));
      }
      return res.redirect('/error?message=' + encodeURIComponent(err.message));
    }
  })(req, res, next);
});

app.get(
  "/auth/linkedin/callback",
  (req, res, next) => {
    passport.authenticate("linkedin", (err, user, info) => {
      if (err) {
        console.error('Callback Error:', err);
        return res.redirect('/error?message=' + encodeURIComponent(err.message));
      }
      if (!user) {
        return res.redirect('/error?message=Authentication failed');
      }
      req.logIn(user, (err) => {
        if (err) {
          console.error('Login Error:', err);
          return res.redirect('/error?message=' + encodeURIComponent(err.message));
        }
        return res.redirect('/profile');
      });
    })(req, res, next);
  }
);

// Error route
app.get("/error", (req, res) => {
  const errorMessage = req.query.message || 'An unknown error occurred';
  res.send(`
    <h1>Error</h1>
    <p>${errorMessage}</p>
    <h2>Steps to fix:</h2>
    <ol>
      <li>Go to <a href="https://www.linkedin.com/developers/apps" target="_blank">LinkedIn Developer Console</a></li>
      <li>Select your application</li>
      <li>Go to the "Auth" tab</li>
      <li>Under "OAuth 2.0 scopes", click "Add scope"</li>
      <li>Select "r_liteprofile" from the list</li>
      <li>Save the changes</li>
      <li>Come back here and try again</li>
    </ol>
    <a href="/">Back to home</a>
  `);
});

app.get("/profile", async (req, res) => {
  if (!req.user) return res.redirect("/");
  
  try {
    res.send(`
      <h1>Welcome ${req.user.displayName}</h1>
      <h2>Profile Information:</h2>
      <pre>${JSON.stringify(req.user, null, 2)}</pre>
      <a href="/logout">Logout</a>
    `);
  } catch (error) {
    console.error('Profile Error:', error);
    res.status(500).send(`
      <h1>Error fetching profile</h1>
      <p>${error.message}</p>
      <a href="/">Back to home</a>
    `);
  }
});

app.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Global Error:', err.stack);
  res.status(500).send(`
    <h1>Something broke!</h1>
    <p>${err.message}</p>
    <a href="/">Back to home</a>
  `);
});

app.listen(3000, () => {
  console.log("Server started on http://localhost:3000");
});
