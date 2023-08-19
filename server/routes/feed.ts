const express = require('express');
const feedRouter = express.Router();
const { Reels, Users, Events, Friendships, Likes } = require('../db/index');
// import Reels from '../db/index';

feedRouter.get('/reel', (req: any, res: any) => {
  // will be changed to find by filter
  Reels.findAll({ include: [
    { model: Users },
    { model: Events }
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
      accepter_id: id // CHANGED from requester_id: id
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

// get pending friends // WORKS GREAT!
feedRouter.get('/friendlist/pending', (req: any, res: any) => {
  const { id } = req.user;
  Friendships.findAll({
    where: {
      status: 'pending',
      accepter_id: id, // accepter_id CHANGE
    },
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
    });
});

// delete a reel REMEMBER TO DESTROY THE LIKES ENTRIES TOO
feedRouter.delete('/delete/:id', (req: any, res: any) => {
  const { id } = req.params; // id is ReelId in Likes table

  Reels.destroy({
    where: {
      id: id
    }
  })
    // .then((response: any) => {
    //   Likes.destroy({
    //     where: {
    //       ReelId: null,
    //     },
    //   })
    // })
    .then((response: any) => {
      if (response) {
        // console.log('Reels deleted:', response);
        res.sendStatus(200);
      } else {
        console.log('Reel does not exist');
        res.sendStatus(404);
      }
    })
    .catch((err: any) => {
      console.error('Failed to DELETE Reel:', err);
    })
});

// GET your own reels
feedRouter.get('/reel/user', (req: any, res: any) => {
  const { id } = req.user;

  Reels.findAll({ include: [
    { model: Users },
    { model: Events }
  ],
    where: {
      UserId: id,
    }})
    .then((response: any) => {
      if (response === null) {
        console.log('user feed/reels does not exist');
        res.sendStatus(404);
      } else {
        res.status(200).send(response);
      }
    })
    .catch((err: any) => {
      console.error('Cannot GET user reels:', err);
      res.sendStatus(500);
    })
});

export default feedRouter;

