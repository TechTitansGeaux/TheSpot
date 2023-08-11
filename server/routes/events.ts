/* eslint-disable @typescript-eslint/no-explicit-any */
import { Router } from 'express';
const eventRouter = Router();
const { Events } = require('../db/index');

// get event by location?

// create new event
eventRouter.post('/create', async (req, res) => {
  // access event properties from request body
  const { name, date, geolocation, twenty_one } = req.body;
  // sequelize create method
  const event = await Events.create({
    name,
    date,
    geolocation,
    twenty_one
  })
  .then((resObj: any) => {
    console.log(resObj, '<--- response object from create event')
    res.status(201).json({
      success: true,
      event
    })
  })
  .catch((err: any) => {
    console.log('Failed to CREATE event: ', err)
    res.status(500).json('Failed to CREATE event');
  })
})

export default eventRouter;
