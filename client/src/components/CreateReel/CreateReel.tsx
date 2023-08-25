  /* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from 'react';
import axios from 'axios';
import { useState, useRef, useEffect } from "react";
import VideoRecorder from './VideoRecorder';
import dayjs from 'dayjs';
// import * as dotenv from 'dotenv';

// dotenv.config();

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
    address: 'placeholder address',
    twenty_one: false,
    isPublic: false,
    createdAt: '',
    updatedAt: '',
    PlaceId: 0
  });
  const [mustCreateEvent, setMustCreateEvent] = useState(false);
  const [currentAddress, setCurrentAddress] = useState('');


  // today variable
  const today = dayjs(new Date()).format('YYYY-MM-DD');
  // current time variable
  const timeNow = dayjs(new Date()).format('HH:mm:ss');

// check to see if there are any events happening at users location today
const eventCheck = () => {
  console.log('checking for event')
  axios.get(`/events/${user.geolocation}/${today}`)
    .then((resObj) => {
      // response object is event happening at LOCATION; must check to see if theres one happening at NOW
      // iterate through HERE/ TODAY events
      for (let i = 0; i < resObj.data.length; i++) {
        //determine if any are happening right now
        if (resObj.data[i].time <= timeNow && resObj.data[i].endTime >= timeNow) {
          setCurrentEvent(resObj.data[i]);
          console.log('found an event')
        } else {
          setMustCreateEvent(true)
        }
      }
      if (resObj.data.length === 0) {
        setMustCreateEvent(true)
      }
    })
    .catch((err) => {
      setMustCreateEvent(true);
      console.error('Failed axios get event: ', err)
    })
}

// turn user's current geolocation into an address so that correct
// address for event saves to DB + displays in all needed places
const getCurrentAddress = () => {
  // grab users lat and lng
  const [lat, lng] = user.geolocation.split(',');
  axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&location_type=ROOFTOP&result_type=street_address&key=${process.env.REACT_APP_GEOCODING_API}`)
    .then((response) => {
      console.log(response.data.results[0].formatted_address, '<-----res from reverse geocoding fetch')
      setCurrentAddress(response.data.results[0].formatted_address)
    })
    .catch((err) => {
      console.error('Failed to fetch address: ', err);
    })
}



useEffect(() => {
  eventCheck();
  getCurrentAddress();
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
      updateMustCreateEvent={updateMustCreateEvent}
      currentAddress={currentAddress}/>
    </div>
  )
};

export default CreateReel;
