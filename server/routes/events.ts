/* eslint-disable @typescript-eslint/no-explicit-any */
import { Router } from 'express';
const eventRouter = Router();
const { Events } = require('../db/index');

// get all events
eventRouter.get('/all', async (req, res) => {
  await Events.findAll()
    .then((events: any) => {
      // console.log('events: ', events);
      res.status(200).send(events);
    })
    .catch((err: any) => {
      console.error('Failed to GET all events: ', err);
    })
})

// get all of one user's events
eventRouter.get('/userEvents', async (req: any, res: any) => {
  // access user id from req.user
  const { userId } = req.user;

  await Events.findAll({where: {userId: userId}})
    .then((resObj) => {
      console.log(resObj, '<----res from get all user\'s events')
      res.status(200).send(resObj);
    })
    .catch((err) => {
      console.error('Failed to GET all of user\'s events: ', err);
      res.sendStatus(500)
    })
})

// get event by location AND date 
eventRouter.get('/:geolocation/:date', async (req: any, res: any) => {
  // access geolocation from request parameters
  const { geolocation, date } = req.params;
  // find event by geolocation
    await Events.findAll({where: {geolocation: geolocation, date: date}})
    .then((events: any) => {
       console.log(events, '<-----response from get event by location')
      if (events.length !== 0) {
        res.status(200).json({
          events
      })
      } else {
        res.status(404).send('No events found at this location');
      }
    })
    .catch((err: any) => {
      console.error('Failed to GET event: ', err)
      res.sendStatus(500);
    })


})


// create new event
eventRouter.post('/create', async (req, res) => {
  // access event properties from request body
  const { name, date, time, endTime, geolocation, twenty_one } = req.body;
  // sequelize create method
  await Events.create({
    name,
    date,
    time,
    endTime,
    geolocation,
    twenty_one
  })
  .then((event: any) => {
    res.status(201).json({
      event
    })
  })
  .catch((err: any) => {
    console.log('Failed to CREATE event: ', err)
    res.sendStatus(500)
  })
})

// patch event
eventRouter.patch('/:id', async (req: any, res) => {
  const { id } = req.params;
  const { name, date, time, endTime, twenty_one } = req.body;

  try {
    // find event by id
    const event = await Events.findOne({
      where: {
        id: id
      }
    });

    if (!event) {
      // send 404 if event does not exist
      return res.status(404).json({ error: 'User not found' });
    }

    // update event info
    await event.update({name: name, date: date, time: time, endTime: endTime, twenty_one: twenty_one }, {
      where: {
        id: id
      }
    });

    // send back updated event
    res.json(event);
  } catch (err: any) {
    console.error('Failed to PATCH event: ', err);
    res.sendStatus(500)
  }
})

export default eventRouter;
