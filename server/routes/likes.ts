const express = require('express');
const likesRouter = express.Router();
const { Likes, Reels } = require('../db/index');


// update route increment likes
likesRouter.put('/addLike/:ReelId', (req: any, res: any) => {
  const { ReelId } = req.params;
  const { id } = req.user; // req.user ACTUALLY // tested with req.body
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
      Likes.create({
        UserId: id,
        ReelId: ReelId,
      });
    })
    .then((response: any) => {
      console.log('Likes UPDATE addLike success');
      res.sendStatus(200);
    })
    .catch((err: any) => {
      console.error('likeRouter PUT addLike from database Error', err);
      res.sendStatus(500);
    });
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
      console.log('Likes UPDATE removeLike success');
      res.sendStatus(200);
    })
    .catch((err: any) => {
      console.error('likeRouter PUT removeLike from database Error', err);
      res.sendStatus(500);
    });
});

export default likesRouter;
