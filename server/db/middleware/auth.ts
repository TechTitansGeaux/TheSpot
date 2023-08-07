import { Request, Response, NextFunction } from 'express';

export const isUserAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if (req.user) {
    next();
  } else {
    res.status(401).send('You must login!');
  }
};
