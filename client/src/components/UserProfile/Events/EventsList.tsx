import * as React from 'react';
import { useState, useEffect } from 'react';
import EventsEntry from './EventsEntry';
import axios from 'axios';

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

  const [events, setEvents] = useState([])

  // get all of user's events
  const getMyEvents = () => {
    axios.get('/events/userEvents')
      .then((res) => {
        setEvents(res.data);
      })
      .catch((err) => {
        console.error('Failed to axios GET user events: ', err);
      })
  }
  console.log(events, '<---- my events')

  useEffect(() => {
    getMyEvents();
  }, [])
  return (
    <div className='container-full-w'>
      <h1>EventsList</h1>
      <EventsEntry />
    </div>
  );
};

export default EventsList;
