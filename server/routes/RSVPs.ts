/* eslint-disable @typescript-eslint/no-explicit-any */
import { Router } from 'express';
const rsvpRouter = Router();
const { RSVPs, Events, Users } = require('../db/index');

// get all RSVPs from given userID
rsvpRouter.get('/forUser', (req: any, res: any) => {
  // access id from user
  const { id } = req.user;
  // sequelize find all where method
  RSVPs.findAll({
    where: {
      UserId: id
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

// get all RSVPs AND include Users and Events joined
rsvpRouter.get('/all', (req: any, res: any) => {
  //include model: Users and model: Events
  RSVPs.findAll({ include: [{ model: Users }, { model: Events }] })
    .then((response: any) => {
      if (response === null) {
        console.log('RSVPs do not exist');
        res.sendStatus(404);
      } else {
        res.status(200).send(response);
      }
    })
    .catch((err: any) => {
      console.error('Database ERROR gettings all RSVPs', err);
      res.sendStatus(500);
  })
})

// post to increment rsvp_count on Event AND create RSVP in table
rsvpRouter.post('/addRsvp/:EventId', (req: any, res: any) => {
  // increment the Events rsvp_count where the EventId from params
  // then create RSVPs row of UserId as req.user = id AND EventId from from params
})

export default rsvpRouter;
