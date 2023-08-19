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

  // function to get all of user's events
  const getMyEvents = () => {
    axios.get('/events/userEvents')
      .then((res) => {
        setEvents(res.data);
      })
      .catch((err) => {
        console.error('Failed to axios GET user events: ', err);
      })
  }
  // call my my events once when page is rendered
  useEffect(() => {
    getMyEvents();
  }, [])

  return (
    <div className='container-full-w'>
      <h1>EventsList</h1>
      {events.map((event) => {
        return (
          <EventsEntry
          event={event}
          key={'event' + event.id}/>
        )
      })}

    </div>
  );
};

export default EventsList;
