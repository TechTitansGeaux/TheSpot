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

// put to increment rsvp_count on Event AND create RSVP in table
rsvpRouter.put('/addRsvp/:EventId', (req: any, res: any) => {
  // increment the Events rsvp_count where the EventId from params
  const { EventId } = req.params;
  // then create RSVPs row of UserId as req.user = id AND EventId from from params
  const { id } = req.user // must be req.user // USE req.body for postman

  Events.increment({
    rsvp_count: 1,
  },
    {
      where: {
        id: EventId
    }
    })
    .then((response: Express.Response) => {
      console.log('RSVP response', response)
      RSVPs.findOrCreate({
        where: {
        UserId: id,
        EventId: EventId
      },
      defaults: {
          UserId: id,
          EventId: EventId
        }
      });
      res.sendStatus(201);
    })
    .catch((err: any) => {
      console.error('RSVP error in post', err);
      res.sendStatus(500);
  })
})

// delete a user rsvp
rsvpRouter.delete('/delete/:EventId', (req: any, res: any) => {
    const { EventId } = req.params;
    const { id } = req.user; // req.body needs to be req.user
  Events.decrement(
      {
        rsvp_count: 1,
      },
      {
        where: {
          id: EventId,
        },
      }
    )
      .then((response: any) => {
        console.log('RSVP deleted', response);
         RSVPs.destroy({
           where: {
             UserId: id,
             EventId: EventId,
           },
         })
        res.sendStatus(200);
      })
      .catch((err: any) => {
        console.error('RSVP delete request Database fa9l', err);
        res.sendStatus(500);
    })
  }
);

export default rsvpRouter;
