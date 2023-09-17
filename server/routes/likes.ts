const express = require('express');
const likesRouter = express.Router();
const { Likes, Reels, Users } = require('../db/index');



// update route increment likes
likesRouter.put('/addLike/:ReelId', (req: any, res: any) => {
  const { ReelId } = req.params;
  const { id } = req.user; // req.user ACTUALLY // tested with req.body
  // if conditional for UserId
  Reels.increment(
    {
      like_count: 1,
    },
    {
      where: {
        id: ReelId,
      },
    }
  )
    .then((response: any) => {
      Likes.findOrCreate(
        {
          where: { UserId: id, ReelId: ReelId },
          defaults: {
            UserId: id, ReelId: ReelId
          }
        })
        .then((response: any) => {
          console.log('Likes UPDATE addLike success', response);
          res.sendStatus(200);
        })
        .catch((err: any) => {
          console.error('likeRouter PUT addLike from database Error', err);
          res.sendStatus(500);
        });
    })
});

// update route decrement likes
likesRouter.put('/removeLike/:ReelId', (req: any, res: any) => {
  const { ReelId } = req.params;
  const { id } = req.user; // req.user ACTUALLY // tested with req.body
  Reels.decrement(
    {
      like_count: 1,
    },
    {
      where: {
        id: ReelId,
      },
    }
  )
    .then((response: any) => {
      Likes.destroy({
        where: {
          UserId: id,
          ReelId: ReelId,
        },
      });
    })
    .then((response: any) => {
      // console.log('Likes UPDATE removeLike success');
      res.sendStatus(200);
    })
    .catch((err: any) => {
      console.error('likeRouter PUT removeLike from database Error', err);
      res.sendStatus(500);
    });
});

// GET likes from likes table in most recent order
likesRouter.get('/likes', (req: any, res: any) => {

  Likes.findAll({
    order: [['createdAt', 'DESC']],
    include: [{ model: Users }, { model: Reels }],
  })
    .then((response: any) => {
      if (response === null) {
        console.log('likes do not exist');
        res.sendStatus(404);
      } else {
        res.status(200).send(response);
      }
    })
    .catch((err: any) => {
      console.error('Cannot GET likes:', err);
      res.sendStatus(500);
    });
});

// UPDATE checked column to true
likesRouter.put('/checked/:id', (req: any, res: any) => {
  const { id } = req.params;

  Likes.update({ checked: true}, {
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

// GET likes from likes table in most recent order AND Reels UserId === user.id
likesRouter.get('/likesuser', (req: any, res: any) => {
  const { id } = req.user;
  Likes.findAll({
    order: [['createdAt', 'DESC']],
    include: [{ model: Users }, { model: Reels,
      where: { UserId: id} }],

  })
    .then((response: any) => {
      if (response === null) {
        console.log('likes do not exist');
        res.sendStatus(404);
      } else {
        res.status(200).send(response);
      }
    })
    .catch((err: any) => {
      console.error('Cannot GET likes:', err);
      res.sendStatus(500);
    });
});

// GET likes from likes table in most recent order AND by checked is null
likesRouter.get('/likesusernull', (req: any, res: any) => {
  const { id } = req.user;
  Likes.findAll({
    order: [['createdAt', 'DESC']],
    include: [{ model: Users }, { model: Reels,
      where: { UserId: id} }],
    where: { checked: null},
  })
    .then((response: any) => {
      if (response === null) {
        console.log('likes do not exist');
        res.sendStatus(404);
      } else {
        res.status(200).send(response);
      }
    })
    .catch((err: any) => {
      console.error('Cannot GET likes:', err);
      res.sendStatus(500);
    });
});

export default likesRouter;
