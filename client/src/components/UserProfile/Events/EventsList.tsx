import * as React from 'react';
import EventsEntry from './EventsEntry';

type Props = {
  user: {
    id: number;
    username: string;
    displayName: string;
    type: string;
    geolocation: string;
    mapIcon: string;
    birthday: string;
    privacy: string;
    accessibility: string;
    email: string;
    picture: string;
    googleId: string;
  };
};
const EventsList: React.FC<Props> = ({user}) => {

  // get all of user's events
  return (
    <div className='container-full-w'>
      <h1>EventsList</h1>
      <EventsEntry />
    </div>
  );
};

export default EventsList;
