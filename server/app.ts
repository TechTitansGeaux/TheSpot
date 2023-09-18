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
import followersRouter from './routes/followers'
import rsvpRouter from './routes/RSVPs';
const MemoryStore = require('memorystore')(session);



// const {Request, Response} = require('express')
import { Request, Response } from 'express';

const port = 4000;

// check this after building webpack
const distPath = path.resolve(__dirname, '..', 'client/dist');

//generate secret key
const app = express();
const uuid = require('uuid');
const secretKey = uuid.v4();

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: '100mb' }));
app.use(express.static(distPath));
// users session

/**
A session store implementation for Express using lru-cache.
Because the default MemoryStore for express-session will lead to a memory leak due to it haven't a suitable way to make them expire. */
app.use(
  session({
    cookie: { maxAge: 86400000 },
    store: new MemoryStore({
      checkPeriod: 86400000, // prune expired entries every 24h
    }),
    secret: secretKey,
    resave: false,
    saveUninitialized: false,
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
// likes route
app.use('/likes', likesRouter)
// followers route
app.use('/followers', followersRouter)
// RSVPs route
app.use('/RSVPs', rsvpRouter)

// server setup for sockets
import { createServer } from "http";
const httpServer = createServer(app);
import { Server } from "socket.io";
const io = new Server(httpServer, {
  cors: {
    origin: "https://www.thespot.live/",
    allowedHeaders: ["my-custom-header"],
    methods: ["GET", "POST"],
    credentials: true
  }
});


app.get('/*', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'), (err) => {
    if (err) {
      res.status(500).send(err);
    }
  });
});

httpServer.listen(port, () => {
  console.log(`⚡️ Server listening at http://localhost:${port}`);
});