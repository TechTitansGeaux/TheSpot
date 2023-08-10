const express = require('express');
const feedRouter = express.Router();
const { Reels, Users, Events, Friendships } = require('../db/index');
// import Reels from '../db/index';

feedRouter.get('/reel', (req: any, res: any) => {
  // will be changed to find by filter
  Reels.findAll({ include: [
    {
      model: Users
    },
    {
      model: Events
    }
  ]})
    .then((response: any) => {
      if (response === null) {
        console.log('feed does not exist');
        res.sendStatus(404);
      } else {
        res.status(200).send(response);
      }
    })
    // .then((response: any) =>{
    //   const { user_id } = req.body;
    //   console.log(user_id);
    // })
    .catch((err: any) => {
      console.error('Cannot GET feed:', err);
      res.sendStatus(500);
    })
});

feedRouter.get('/recent', (req: any, res: any) => {
  // filter by most recent
  Reels.findAll({ include: [
    { model: Users} ,
    { model: Events }
  ],
   order: [['createdAt', 'DESC']]})
    .then((response: any) => {
      if (response === null) {
        console.log('feed does not exist');
        res.sendStatus(404);
      } else {
        res.status(200).send(response);
      }
    })
    // .then((response: any) =>{
    //   const { user_id } = req.body;
    //   console.log(user_id);
    // })
    .catch((err: any) => {
      console.error('Cannot GET feed:', err);
      res.sendStatus(500);
    })
});

feedRouter.get('/likes', (req: any, res: any) => {
  // filter by most likes
  Reels.findAll({ include: [
    { model: Users} ,
    { model: Events }
  ],
   order: [['like_count', 'DESC']]})
    .then((response: any) => {
      if (response === null) {
        console.log('feed does not exist');
        res.sendStatus(404);
      } else {
        res.status(200).send(response);
      }
    })
    // .then((response: any) =>{
    //   const { user_id } = req.body;
    //   console.log(user_id);
    // })
    .catch((err: any) => {
      console.error('Cannot GET feed:', err);
      res.sendStatus(500);
    })
});

// friends list
feedRouter.get('/friendlist', (req: any, res: any) => {
  const { id } = req.user;
  Friendships.findAll({
    where: {
      status: 'approved',
      requester_id: id
    }
  })
    .then((response: any) => {
      if (response === null) {
        console.log('friends do not exist');
        res.sendStatus(404);
      } else {
        res.status(200).send(response);
      }
    })
    .catch((err: any) => {
      console.error('Cannot GET friends', err);
      res.sendStatus(500);
    })
});



export default feedRouter;

