const express = require('express');
const followersRouter = express.Router();
const { Followers } = require('../db/index');


// GET request to get all followers per user
followersRouter.get('/', (req: any, res: any) => {
  // res.json('get route connected');
  const { id } = req.user; // needs to be current user i.e. req.user // req.body for postman
  Followers.findAll({
    where: {
      follower_id: id
    }
  })
    .then((response: any) => {
      if (response === null) {
        console.log('no followers exist');
        res.sendStatus(404);
      } else {
        res.status(200).send(response);
      }
    })
    .catch((err: any) => {
      console.error('Cannot get followers', err);
      res.sendStatus(500);
    })
})

// POST request to get all followers per req.user
followersRouter.put('/', (req: any, res: any) => {
  // res.json('Post route connected');
  const { id } = req.user; // needs to be current user i.e. req.user // req.params w/ param for postman
  const { followedUser_id } = req.body;
  Followers.findOrCreate({
    where: {
      status: 'follower',
      follower_id: followedUser_id,
      followedUser_id: id,
    },
    defaults: {
      status: 'follower',
      follower_id: followedUser_id,
      followedUser_id: id,
    },
  })
    .then((data: any) => {
      Followers.findOrCreate({
        where: {
          status: 'follower',
          follower_id: id,
          followedUser_id: followedUser_id,
        },
        defaults: {
          status: 'follower',
          follower_id: id,
          followedUser_id: followedUser_id,
        },
      });
      res.sendStatus(201);
    })
    .catch((err: any) => {
      console.error();
    });
})

// DELETE request to unfollow a user
followersRouter.delete('/:followedUser_id', (req: any, res: any) => {
  const { followedUser_id } = req.params;
  const { id } = req.user; // needs to be current user i.e. req.user // req.body in postman
  Followers.destroy({
    where: {
      follower_id: [id, followedUser_id],
    },
  })
    .then((data: any) => {
      res.sendStatus(200);
    })
    .catch((err: any) => {
      console.error('followersRouter DELETE to database Error:', err);
    });
})

// UPDATE checked column to true
followersRouter.put('/checked/:id', (req: any, res: any) => {
  const { id } = req.params;

  Followers.update({ checked: true}, {
    where: {
      id: id,
    }
  }
    )
    .then((response: any) => {
      // console.log('Likes checked UPDATED');
      res.sendStatus(200);
    })
    .catch((err: any) => {
      console.error('Cannot UPDATE checked:', err);
      res.sendStatus(500);
    })
});


export default followersRouter;
