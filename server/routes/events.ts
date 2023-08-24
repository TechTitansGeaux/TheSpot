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
  const { id } = req.user;

  await Events.findAll({where: {userId: id}})
    .then((resObj: any) => {
      res.status(200).send(resObj);
    })
    .catch((err: any) => {
      console.error('Failed to GET all of user\'s events: ', err);
      res.sendStatus(500)
    })
})

  // find distance (miles) with 2 points
  const distance = (lat1: number, lat2: number, lon1: number, lon2: number) => {

    lon1 = lon1 * Math.PI / 180;
    lon2 = lon2 * Math.PI / 180;
    lat1 = lat1 * Math.PI / 180;
    lat2 = lat2 * Math.PI / 180;
    // Haversine formula
    const dlon = lon2 - lon1;
    const dlat = lat2 - lat1;
    const a = Math.pow(Math.sin(dlat / 2), 2)
              + Math.cos(lat1) * Math.cos(lat2)
              * Math.pow(Math.sin(dlon / 2),2);

    const c = 2 * Math.asin(Math.sqrt(a));

    const r = 3956;

    return ((c * r) / 5280);
  };

// get event by location AND date
eventRouter.get('/:geolocation/:date', async (req: any, res: any) => {
  // access geolocation from request parameters
  const { geolocation, date } = req.params;
  // find all events on date
  await Events.findAll({where: {date: date}})
  .then((events: any) => {
    if (events.length !== 0) {
        // filter for within range events
        events.filter((event: {geolocation: string}) => {
          const [lat1, lng1] = event.geolocation.split(',');
          const [lat2, lng2] = geolocation.split(',');
          // if distance b/t user and center of event is less than 300ft
          return distance(+lat1, +lat2, +lng1, +lng2) < 300
        })
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
  const { name, date, time, endTime, geolocation, twenty_one, UserId } = req.body;
  // sequelize create method
  await Events.create({
    name,
    date,
    time,
    endTime,
    geolocation,
    twenty_one,
    UserId
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

// delete an event
eventRouter.delete('/delete/:id', async (req: any, res: any) => {
  // access event id from request parameters
  const { id } = req.params;

  await Events.destroy({
    where: { id }
  })
    .then((resObj: any) => {
      // console.log(resObj, '<----res from delete event')
      res.sendStatus(200);
    })
    .catch((err: any) => {
      console.error('Failed to DELETE event: ', err);
      res.sendStatus(500);
    })
})

export default eventRouter;
