/* eslint-disable @typescript-eslint/no-explicit-any */
import { Router } from 'express';
const eventRouter = Router();
const { Events } = require('../db/index');

// get event by location
eventRouter.get('/:geolocation', async (req: any, res: any) => {
  // access geolocation from request parameters
  const { geolocation } = req.params;
  // find event by geolocation
    await Events.findOne({where: {geolocation: geolocation}})
    .then((event: any) => {
      if (event !== null) {
        res.status(200).json({
          event
      })
      } else {
        res.status(404).send('No event found at this location');
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
  const { name, date, geolocation, twenty_one } = req.body;
  // sequelize create method
  await Events.create({
    name,
    date,
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

export default eventRouter;
