import google from "passport-google-oauth2";
import passport from "passport";
import User from "../models/User.js";

const GoogleStrategy = google.Strategy;

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "https://p2p-qrjp.onrender.com/api/v1/auth/google/callback",
      passReqToCallback: true,
    },
    function (request, accessToken, refreshToken, profile, done) {
      User.findOne({ googleId: profile.id })
        .then(async (user) => {
          if (!user) {
            // check if user already signed up with email and password
            const userWithEmail = await User.findOne({ email: profile.email });
            if (userWithEmail) {
              return userWithEmail;
            }

            const newUser = await User.create({
              googleId: profile.id,
              fullname: `${profile.name.givenName} ${profile.name.familyName}`,
              email: profile.email,
            });

            return newUser;
          }
          return user;
        })
        .then((user) => done(null, user))
        .catch((err) => done(err));
    }
  )
);

export { passport };
