const express = require('express');
const friendRouter = express.Router();
const { Friendships, Reels, Users, Events } = require('../db/index');

// GET request for all friendships
friendRouter.get('/', (req: any, res: any) => {
  Friendships.findAll()
    .then((data: any) => {
      res.status(200).send(data);
    })
    .catch((err: any) => {
      console.error('friendRouter GET from database Error', err);
      res.sendStatus(500);
    });
});

//  POST request for friendship with 'pending' status
friendRouter.post('/', (req: any, res: any) => {
  // REQUESTER is req.user
  const { id } = req.user;
  const { accepter_id } = req.body;
  Friendships.bulkCreate([
    // set to approved for testing
    { status: 'pending', requester_id: id, accepter_id },
    { status: 'pending', requester_id: accepter_id, accepter_id: id },
  ])
    .then((data: any) => {
      res.sendStatus(201);
    })
    .catch((err: any) => {
      console.error('friendRouter POST to database Error:', err);
    });
});

// PUT request to update friendship with 'approved' status
friendRouter.put('/', (req: any, res: any) => {
  // ACCEPTER is req.user
  const { id } = req.user;
  const { requester_id } = req.body;
  Friendships.update(
    { status: 'approved' },
    {
      where: {
        accepter_id: [id, requester_id],
        requester_id: [id, requester_id],
        status: 'pending'
      },
    }
  )
    .then((data: any) => {
      res.sendStatus(200);
    })
    .catch((err: any) => {
      console.error('friendRouter UPDATE to database Error:', err);
    });
});

// DELETE request to delete a friend

friendRouter.delete('/:otherUsersId',  (req: any, res: any) => {
  // ACCEPTER is req.user
  const { id } = req.user;
  const { otherUsersId } = req.params;
  const { updatedAt } = req.body;
  Friendships.destroy(
    {
      where: {
        requester_id: [id, otherUsersId],
        updatedAt: updatedAt
      },
    }
  )
    .then((data: any) => {
      Friendships.destroy({
        where: {
          accepter_id: [id, otherUsersId],
          updatedAt: updatedAt
        },
      });
    })
    .then((data: any) => {
      res.sendStatus(200);
    })
    .catch((err: any) => {
      console.error('friendRouter DELETE to database Error:', err);
    });
});

export default friendRouter;

