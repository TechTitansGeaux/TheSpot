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
  return (
    <div className='container-full-w'>
      <h1>EventsList</h1>
      <EventsEntry />
    </div>
  );
};

export default EventsList;
