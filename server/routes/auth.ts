/* eslint-disable @typescript-eslint/no-unused-vars */
import express from 'express';
import passport from 'passport';
import { isUserAuthenticated } from '../db/middleware/auth';
import { SessionData } from 'express-session';
const { Users } = require('../db/index');
require('dotenv').config();
const auth = express.Router();
const successLoginUrl = `${process.env.HOST}:4000/Feed`;
const successNewUserUrl = `${process.env.HOST}:4000/ProfileSetUp`;
const errorLoginUrl = `${process.env.HOST}:4000/login/error`;


auth.get(
  '/login/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);
auth.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: errorLoginUrl }),
  async (req: any, res: express.Response) => {
    try {
      if (req.user) {
        // Check if the user exists in the database by googleId
        const existingUser = await Users.findOne({ where: { id: req.user?.id } });
        if (existingUser.username === null) {
          // New user, redirect to Feed
          res.redirect(successNewUserUrl);
        } else {
          // User exists in the database, redirect to Feed
          res.redirect(successLoginUrl);
        }
      }
    } catch (error) {
      console.error(error);
      res.redirect(errorLoginUrl);
    }
  }
);
auth.get(
  '/test',
  isUserAuthenticated,
  (req: express.Request, res: express.Response) => {
    // Do something for the authenticated user
  }
);
export default auth;