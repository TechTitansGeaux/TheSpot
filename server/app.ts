require('dotenv').config();
// require('./auth/passport');
import express from 'express';
import session from 'express-session';
import path from 'path';
import passport from 'passport';
import authRoutes from './routes/auth';
import users from './routes/users';
import reelRouter from './routes/createReel'
import "./db/auth/passport";
import feedRouter from './routes/feed';
import friendRouter from './routes/friends';
import eventRouter  from './routes/events';
import likesRouter  from './routes/likes';



// const {Request, Response} = require('express')
import { Request, Response } from 'express';

const port = 4000;

// check this after building webpack
const distPath = path.resolve(__dirname, '..', 'client/dist');

//generate secret key
const app = express();
const uuid = require('uuid');
const secretKey = uuid.v4();

// server setup for sockets
import http from 'http';
const server = http.createServer(app);
import { Server } from "socket.io";
const io = new Server(server);

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(distPath));
// users session
app.use(
  session({
    secret: secretKey,
    resave: false,
    saveUninitialized: false
  })
);
app.use(passport.initialize());
app.use(passport.session());

// routes
app.use('/users', users);
app.use('/auth', authRoutes);
// reels route
app.use('/reel', reelRouter);
// feed route
app.use('/feed', feedRouter);
// friends route
app.use('/friends', friendRouter);
// events route
app.use('/events', eventRouter)
// events route
app.use('/likes', likesRouter)


app.get('/*', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'), (err) => {
    if (err) {
      res.status(500).send(err);
    }
  });
});

server.listen(port, () => {
  console.log(`⚡️ Server listening at http://localhost:${port}`);
});