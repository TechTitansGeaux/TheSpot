/* eslint-disable @typescript-eslint/no-explicit-any */
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
const { Users } = require('../index');
import * as dotenv from 'dotenv';

dotenv.config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: `${process.env.HOST}/auth/google/callback`,
      passReqToCallback: true
    },
    async (req, accessToken: any, refreshToken: any, profile: any, done: any) => {
      try {
        if (!profile || !profile.displayName || profile.picture === 'no pic') {
          // Handle the case where the profile is missing or the displayName property is not present
          return done(new Error("Invalid profile data"), null);
        }

        const defaultUser = {
          displayName: profile.displayName,
          email: profile.emails[0]?.value,
          picture: profile.photos[0]?.value,
          googleId: profile.id,
          geolocation: '-24.4879217, -46.6741555'
        };

        // check if the user already exists in the database, if not create one
        const user = await Users.findOrCreate({ where: { googleId: profile.id }, defaults: defaultUser });

        if (user && user[0]) {
          return done(null, user[0]);
        }
      } catch (error) {
        console.error(error);
        done(error, null);
      }
    }
  )
);

passport.serializeUser((user: any, done: any) => {
  // serialize the user object and store it in the session
  done(null, user.id);
});

passport.deserializeUser(async (id: any, done: any) => {
  // retrieve the user object from the session based on the serialized ID
  try {
    const user = await Users.findOne({ where: { id } });
    if (user) {
      done(null, user);
    } else {
      done(new Error('User not found'), null);
    }
  } catch (error) {
    console.error(error);
    done(error, null);
  }
});

export default passport;
