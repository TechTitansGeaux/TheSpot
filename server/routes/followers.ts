const express = require('express');
const followersRouter = express.Router();
const { Followers } = require('../db/index');

followersRouter.get('/', (req: any, res: any) => {
  res.json('get route connected');
})

export default followersRouter;
