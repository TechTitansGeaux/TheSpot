/* eslint-disable @typescript-eslint/no-explicit-any */
import { Router } from 'express';
const reelRouter = Router();
const { Reels } = require('../db/index');
const cloudinary = require('../cloudinary');
const streamifier = require('streamifier');
const multer = require('multer');

// const upload = multer({dest: 'public/files'});


const uploadReelToCloudinary = async (file: string) => {
  console.log(file, '<------- file from uploadToCloudinary')
  try {
    const result = await cloudinary.uploader.upload(file);
    return result.secure_url;
  } catch (err) {
    console.error('Failed cloudinary reel upload: ', err);
    throw err;
  }
};

// const uploadFromBuffer = (file: any) => {
// console.log(file, '<----- file from uploadFromBuffer')
//   return new Promise((resolve, reject) => {

//     const cld_upload_stream = cloudinary.uploader.upload_stream(
//      {
//        folder: "reels"
//      },
//      (error: any, result: any) => {

//        if (result) {
//          resolve(result);
//        } else {
//          reject(error);
//         }
//       }
//     );

//     streamifier.createReadStream(file.buffer).pipe(cld_upload_stream);
//   });

// };

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

// const fileUpload = multer();

reelRouter.post('/upload', fileUpload.single('file'), async (req: any, res: any) => {
  const file = req.file;
console.log(req.file, '<-----req.file');

  const { id, videoFile, user_id, event_id, text, like_count } = req.body;

  try {
    const cloudURL = await uploadReelToCloudinary(videoFile)
    console.log(videoFile, '<-----videoFile')

    const reel = await Reels.create({
      id,
      // public_id: result.public_id,
      url: cloudURL,
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


export default reelRouter;