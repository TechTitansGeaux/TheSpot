/* eslint-disable @typescript-eslint/no-unused-vars */
import express from 'express';
import passport from 'passport';
import { isUserAuthenticated } from '../db/middleware/auth';
import { SessionData } from 'express-session';
require('dotenv').config();

const auth = express.Router();

const successLoginUrl = `${process.env.HOST}:4000/ProfileSetUp`;
const errorLoginUrl = `${process.env.HOST}:4000/login/error`;

auth.get('/login/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

auth.get('/google/callback', passport.authenticate('google', { failureRedirect: errorLoginUrl, successRedirect: successLoginUrl }), (req: express.Request, res: express.Response) => {
  // Store the user ID in the xsession
  if (req.user) {
    //req.session.userId = req.user.id;
    console.log('USER', req.user);
  }

  // Successful authentication, redirect or respond with a success message
  res.send('Signed In!');
  res.redirect('/ProfileSetUp');
});

auth.get('/test', isUserAuthenticated, (req: express.Request, res: express.Response) => {
  // Do something for the authenticated user
});

export default auth;
