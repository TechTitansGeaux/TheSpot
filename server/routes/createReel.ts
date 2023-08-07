import { Router } from 'express';
const reelRouter = Router();
const { Reels } = require('../db/index')
const cloudinary = require('../cloudinary')

reelRouter.post('/', async (req, res) => {

  // access properties of reel from req body
  const { id, video, user_id, event_id, text, like_count } = req.body;

  try {
    const result = await cloudinary.uploader.upload(video, {
      folder: reels
    })
    const reel = await Reels.create({
      id,
      video: {
        public_id: result.public_id,
        url: result.secure_url
      },
      user_id,
      event_id,
      text,
      like_count
    });
    res.status(201).json({
      success: true,
      reel
    })
  } catch (error) {
    console.error('Failed to CREATE reel: ', error)
    res.sendStatus(500);
  }
});

module.exports = reelRouter;
