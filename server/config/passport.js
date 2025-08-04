const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const GitHubStrategy = require("passport-github2").Strategy;
const User = require("../models/User");

// Helper to create or find user safely
async function findOrCreateUser(query, userData, done) {
  try {
    let user = await User.findOne(query);
    if (!user) {
      user = await User.create(userData);
    }
    return done(null, user);
  } catch (error) {
    console.error("Error in findOrCreateUser:", error);
    return done(error, null);
  }
}

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
    },
    (accessToken, refreshToken, profile, done) => {
      const query = { googleId: profile.id };
      const userData = {
        googleId: profile.id,
        username: profile.displayName || `GoogleUser-${profile.id}`,
        email: profile.emails?.[0]?.value || `google-${profile.id}@dsa.com`,
      };
      findOrCreateUser(query, userData, done);
    }
  )
);

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: "/auth/github/callback",
    },
    (accessToken, refreshToken, profile, done) => {
      const query = { githubId: profile.id };
      const userData = {
        githubId: profile.id,
        username: profile.username || `GitHubUser-${profile.id}`,
        email: profile.emails?.[0]?.value || `github-${profile.id}@dsa.com`,
      };
      findOrCreateUser(query, userData, done);
    }
  )
);

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser((id, done) =>
  User.findById(id)
    .then((user) => done(null, user))
    .catch((err) => done(err, null))
);
