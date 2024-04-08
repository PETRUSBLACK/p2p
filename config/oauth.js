import google from "passport-google-oauth2";
import passport from "passport";
import User from "../models/User.js";

const GoogleStrategy = google.Strategy;

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/api/v1/auth/google/callback",
      passReqToCallback: true,
    },
    function (request, accessToken, refreshToken, profile, done) {
      User.findOne({ googleId: profile.id })
        .then(async (user) => {
          if (!user) {
            const newUser = new User({
              googleId: profile.id,
              fullname: `${profile.name.givenName} ${profile.name.familyName}`,
              email: profile.email,
            });
            return newUser.save();
          }
          return user;
        })
        .then((user) => done(null, user))
        .catch((err) => done(err));
    }
  )
);

export { passport };
