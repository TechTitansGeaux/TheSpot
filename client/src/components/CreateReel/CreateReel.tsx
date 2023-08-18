  /* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from 'react';
import axios from 'axios';
import { useState, useRef, useEffect } from "react";
import VideoRecorder from './VideoRecorder';
import dayjs from 'dayjs';


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

const CreateReel: React.FC<Props> = ({user}) => {

  const [currentEvent, setCurrentEvent] = useState({
    id: 0,
    name: 'It\'s lit',
    rsvp_count: 0,
    date: dayjs(new Date()).format('YYYY-MM-DD'),
    time: dayjs(new Date()).format('HH:mm:ss'),
    endTime: '',
    geolocation: user.geolocation,
    twenty_one: false,
    createdAt: '',
    updatedAt: '',
    PlaceId: 0
  });
  const [mustCreateEvent, setMustCreateEvent] = useState(false);


  // today variable 
  const today = new Date().toDateString();
  // current time variable
  const timeNow = new Date().toLocaleTimeString();

// check to see if there are any events happening at users location today
const eventCheck = () => {
  axios.get(`/events/${user.geolocation}/${today}`)
    .then((resObj) => {
      console.log(resObj, '<----- axios response for get events by location')
      // response object is event happening at LOCATION; must check to see if theres one happening at NOW
      // iterate through HERE/ TODAY events
      for (let i = 0; i < resObj.data.events; i++) {
        //determine if any are happening right now
        if (resObj.data.events[i].time <= timeNow && resObj.data.events[i].endTime > timeNow) {
          setCurrentEvent(resObj.data.events[i]);
        }
      }
    })
    .catch((err) => {
      setMustCreateEvent(true);
      console.error('Failed axios get event: ', err)
    })
}
// console.log(user.geolocation, '<---- my location')
// console.log(currentEvent, '<----currentEvent')

useEffect(() => {
  eventCheck();
}, [])

const updateMustCreateEvent = () => {
  setMustCreateEvent(false)
}

  return (
    <div>
      <VideoRecorder
      currentEvent={currentEvent}
      currentEventId={currentEvent.id}
      user={user}
      mustCreateEvent={mustCreateEvent}
      updateMustCreateEvent={updateMustCreateEvent}/>
    </div>
  )
};

export default CreateReel;
