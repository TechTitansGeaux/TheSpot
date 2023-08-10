const express = require('express');
const friendRouter = express.Router();
const { Friendships, Reels, Users, Events } = require('../db/index');


// create get request for all friendships
friendRouter.get('/', (req: any, res: any) => {
  Friendships.findAll()
    .then((data: any) => {
      console.log('friendRouter GET data', data);
      res.status(200).send(data);
    })
    .catch((err: any) => {
      console.error('friendRouter GET from database Error', err);
      res.sendStatus(500);
    });
});

// create post request for based with 'pending' status
friendRouter.post('/', (req: any, res: any) => {
  const { requester_id, accepter_id } = req.body;
  Friendships.create({ status: "pending", requester_id, accepter_id })
    .then((data: any) => {
      console.log('friendRoute POST friend data', data);
      res.sendStatus(201);
    })
    .catch((err: any) => {
      console.error('friendRouter POST to database Error:', err);
  })
});

// create get request for based on requestId

export default friendRouter;