import { Router } from 'express';
const reelRouter = Router();
const { Reels } = require('../db/index')
const cloudinary = require('../cloudinary')

reelRouter.post('/', async (req, res) => {

  // access properties of reel from req body
  const { id, video, user_id, event_id, text, like_count } = req.body;


  try {
    const cloudURL = (await uploadReelToCloudinary(video))

    const reel = await Reels.create({
      id,
      // public_id: result.public_id,
      url: cloudURL,
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

const uploadReelToCloudinary = async (reelData: string) => {
  try {
    const result = await cloudinary.uploader.upload_stream('reels', reelData);
    return result.secure_url;
  } catch (err) {
    console.error('Failed cloudinary reel upload: ', err);
    throw err;
  }
};

export default reelRouter;
