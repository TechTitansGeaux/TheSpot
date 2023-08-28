/* eslint-disable @typescript-eslint/no-explicit-any */
import { Router } from 'express';
const reelRouter = Router();
const { Reels } = require('../db/index');
const cloudinary = require('../cloudinary');
const multer = require('multer');
import path from 'path';
import fs from 'fs';

const uploadReelToCloudinary = async (file: string) => {
  try {
    const result = await cloudinary.uploader.upload(file, {
      resource_type: "video",
      format: 'mp4',
      transformation: [
        {aspect_ratio: '3:4', crop: 'fill', width: 465}
      ],
      q_auto: 'eco',
      quality: "70:qmax_20"
    });
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

    const cloudURL = await uploadReelToCloudinary(req.file.path)
    // // cloudURL comes as a mkv, here I jankily turn it into a webm
    // cloudURL = cloudURL.slice(0, cloudURL.length - 3) + 'webm';
    // also jankily getting the publicID
    const cloudID = cloudURL.slice(cloudURL.length - 23, cloudURL.length - 5);

    res.status(200).json({cloudID, cloudURL})
});

// route to create new reel
reelRouter.post('/post', async (req: any, res: any) => {
  // access properties of new reel from request body
  const { EventId, url, public_id, text} = req.body;

  try {
  const reel = await Reels.create({
    public_id,
    url,
    text,
    UserId: req.user.dataValues.id,
    EventId
  }).then(() => {
    // reel has been posted, clear public uploads directory
    clearUploads();
  }).catch((err: any) => {
    console.log('Failed to post reel: ', err)
  });
  res.status(201).json({
    success: true,
    reel
  })

  // console.log(reel, '<---- reel created in server ')
} catch (error) {
  console.error('Failed to CREATE reel: ', error)
  res.sendStatus(500);
}
})

// DELETE ALL FILES FROM PUBLIC UPLOADS AFTER UPLOAD IS COMPLETE

const clearUploads = () => {
  const directory = 'server/public/uploads';
  
  fs.readdir(directory, (err: any, files: any) => {
    if (err) throw err;
  
    for (const file of files) {
      fs.unlink(path.join(directory, file), (err: any) => {
        if (err) throw err;
      });
    }
  });
}


export default reelRouter;