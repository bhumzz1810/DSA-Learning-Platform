// server/config/passport.js
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const GitHubStrategy = require("passport-github2").Strategy;
const User = require("../models/User");

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser((id, done) =>
  User.findById(id)
    .lean()
    .then((user) => done(null, user))
    .catch((err) => done(err))
);

async function upsertFromProfile(provider, profile) {
  // Normalize
  const email =
    profile.emails?.[0]?.value ||
    profile._json?.email || // GitHub sometimes
    null;

  const username =
    profile.displayName ||
    profile.username ||
    [profile.name?.givenName, profile.name?.familyName]
      .filter(Boolean)
      .join(" ") ||
    (email ? email.split("@")[0] : `${provider}-${profile.id}`);

  const filter = email
    ? { $or: [{ [`${provider}Id`]: profile.id }, { email }] }
    : { [`${provider}Id`]: profile.id };

  const update = {
    $setOnInsert: { role: "user", createdAt: new Date() },
    $set: {
      username,
      email, // may be null; schema should allow sparse unique
      [`${provider}Id`]: profile.id,
      updatedAt: new Date(),
    },
  };

  const options = { upsert: true, new: true };
  return User.findOneAndUpdate(filter, update, options);
}

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
    },
    async (_a, _r, profile, done) => {
      try {
        const user = await upsertFromProfile("google", profile);
        done(null, user);
      } catch (e) {
        done(e);
      }
    }
  )
);

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: "/auth/github/callback",
      scope: ["user:email"],
    },
    async (_a, _r, profile, done) => {
      try {
        const user = await upsertFromProfile("github", profile);
        done(null, user);
      } catch (e) {
        done(e);
      }
    }
  )
);

module.exports = passport;
