import * as React from 'react';
import axios from 'axios';
import { useState, useRef, useEffect } from "react";
import VideoRecorder from './VideoRecorder';

type Props = {
  user: {
    id: number;
    username: string;
    displayName: string;
    type: string;
    geolocation: string; // i.e. "29.947126049254177, -90.18719199978266"
    mapIcon: string;
    birthday: string;
    privacy: string;
    accessibility: string;
    email: string;
    picture: string;
    googleId: string;
  };
};

type currentEvent = {
  id: number;
  name: string;
  rsvp_count: number;
  date: string;
  geolocation: string; // i.e. "29.947126049254177, -90.18719199978266"
  twenty_one: boolean;
  createdAt: string;
  updatedAt: string;
  PlaceId: 1;
}

const CreateReel: React.FC<Props> = ({user}) => {

  const [currentEvent, setCurrentEvent] = useState({});


// check to see if there are any events happening at users location
const eventCheck = () => {
  axios.get(`/events/${'29.979197703427907,-90.09631406159835'}`)
    .then(({data}) => {
      setCurrentEvent(data.event);
    })
    .catch((err) => {
      console.error('Failed axios get event: ', err)
    })
}
console.log(currentEvent, '<----currentEvent')

useEffect(() => {
  eventCheck();
}, [])

  return (
    <div>
      <VideoRecorder currentEvent={currentEvent}/>
    </div>
  )
};

export default CreateReel;
