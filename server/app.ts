require('dotenv').config();
// require('./auth/passport');
const express = require('express');
const session = require('express-session');
const path = require('path');
const passport = require('passport');
// const {Request, Response} = require('express')
import { Request, Response } from 'express';

const port = 4000;

// check this after building webpack
const distPath = path.resolve(__dirname, '..', 'dist');

//generate secret key
const app = express();
const uuid = require('uuid');
const secretKey = uuid.v4();

// server setup for sockets
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
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