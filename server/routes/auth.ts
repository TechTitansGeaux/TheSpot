/* eslint-disable @typescript-eslint/no-explicit-any */
import express from 'express';
import passport from 'passport';
//import { isUserAuthenticated } from '../db/middleware/auth';
require('dotenv').config();

const auth = express.Router();

const successLoginUrl = `${process.env.HOST}:4000/ProfileSetUp`;
const errorLoginUrl = `${process.env.HOST}:4000/login/error`;

auth.get('/login/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

auth.get('/google/callback', passport.authenticate('google', { failureRedirect: errorLoginUrl, successRedirect: successLoginUrl }), (req, res) => {
  // Store the user ID in the session
  //req.session.userId = req.user.id;

  // successful authentication, redirect or respond with a success message
  res.send('Signed In!');
  // access the authenticated user from req.user

  console.log('USER', req.user);

  res.redirect('/Feed');
});


//auth.get('/test', isUserAuthenticated, (req: any, res: any) => {});

export default auth;