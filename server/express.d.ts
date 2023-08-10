/* eslint-disable @typescript-eslint/no-unused-vars */
import session from 'express-session';

declare module 'express-session' {
  interface SessionData {
    userId?: number;
    id?: number;
  }
}
