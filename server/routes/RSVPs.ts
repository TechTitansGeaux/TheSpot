/* eslint-disable @typescript-eslint/no-explicit-any */
import { Router } from 'express';
const rsvpRouter = Router();
const { RSVPs } = require('../db/index');

// get all RSVPs from given userID
rsvpRouter.get('/forUser', (req: any, res: any) => {
  // access id from user
  const { id } = req.user;
  // sequelize find all where method
  RSVPs.findAll({
    where: {
      id
    }
  })
  .then((resObj: any) => {
    console.log(resObj, '<----res from find all of my RSVPs');
    res.status(200).send(resObj);
  })
  .catch((err: any) => {
    console.error('Failed to GET all of user\'s RSVPs: ', err);
    res.sendStatus(500);
  })
})

export default rsvpRouter;
