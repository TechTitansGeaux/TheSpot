/* eslint-disable @typescript-eslint/no-explicit-any */
import { Router } from 'express';
const reelRouter = Router();
const { Reels } = require('../db/index');
const cloudinary = require('../cloudinary');
const multer = require('multer');

const uploadReelToCloudinary = async (file: string) => {
  try {
    const result = await cloudinary.uploader.upload(file, {
      resource_type: "video"
    });
    console.log(result, '<-----result from upload to cloudinary')
    return result.secure_url;
  } catch (err) {
    console.error('Failed cloudinary reel upload: ', err);
    throw err;
  }
};

// set up multer storage
const storage = multer.diskStorage({
  destination: (req: any, file: any, cb: any) => {
    cb(null, 'server/public/uploads'); // set the destination folder for uploaded files
  },
  filename: (req: any, file: any, cb: any) => {
    cb(null, Date.now() + '-' + file.originalname); // Set the file name with a timestamp to avoid conflicts
  }
});

const fileUpload = multer({storage});

reelRouter.post('/upload', fileUpload.single('video'), async (req: any, res: any) => {
  console.log(req.file, '<-----req.file');
  console.log(req.body, '<-----req.body');

  const { text, userId, eventId} = req.body;

  try {
    let cloudURL = await uploadReelToCloudinary(req.file.path)
    // cloudURL comes as a mkv, here I jankily turn it into a webm
    cloudURL = cloudURL.slice(0, cloudURL.length - 3) + 'webm';
    // also jankily getting the publicID
    const cloudID = cloudURL.slice(cloudURL.length - 23, cloudURL.length - 5);
    const reel = await Reels.create({
      public_id: cloudID,
      url: cloudURL,
      text,
      userId,
      eventId
    });
    res.status(201).json({
      success: true,
      reel
    })

    console.log(reel, '<---- reel created in server ')
  } catch (error) {
    console.error('Failed to CREATE reel: ', error)
    res.status(500).json('Failed to CREATE reel');
  }
});

export default reelRouter;