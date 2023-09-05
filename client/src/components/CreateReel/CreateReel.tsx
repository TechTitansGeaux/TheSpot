  /* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from 'react';
import axios from 'axios';
import { useState, useEffect } from "react";
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
  }
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
  const [friends, setFriends] = useState([]);


  // today variable
  const today = dayjs(new Date()).format('YYYY-MM-DD');
  // current time variable
  const timeNow = dayjs(new Date()).format('HH:mm:ss');

  // get all frens
  const getFriendList = () => {
    if (user) {
      if (user.type === 'personal') {
        axios
          .get(`/feed/frens`)
          .then((response) => {
            // console.log('friends response.data:', response.data);
            setFriends(response.data);
          })
          .catch((err) => {
            console.error('Could not GET friends:', err);
          })
      }
    }
  };

// check to see if there are any PUBLIC events happening at users location right now
const publicEventCheck = (location: any, date: any, time: any) => {
  axios.get(`/events/${location}/${date}`)
    .then((resObj) => {
      // response object is event happening at LOCATION/ DATE; must check to see if theres one happening at TIME
      // iterate through LOCATION/ DATE events
      // ok, right now we have a list of ALL events, pub or priv
      // we want: all public events AND private events IF the creator is our friend
      for (let i = 0; i < resObj.data.length; i++) {
        //determine if any are happening at time PUBLIC
        if (resObj.data[i].time <= time && resObj.data[i].endTime >= time && resObj.data[i].isPublic) {
          setCurrentEvent(resObj.data[i]);
          setMustCreateEvent(false);
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

const privateEventCheck = (location: any, date: any, time: any) => {

  axios.get(`/events/${location}/${date}`)
  .then((resObj) => {
    // response object is event happening at LOCATION/ DATE; must check to see if theres one happening at TIME
    for (let i = 0; i < resObj.data.length; i++) {
      // iterate through friends
      for (let j = 0; j < friends.length; j++) {
        //determine if any are happening at time AND created by friend
        if (resObj.data[i].time <= time && resObj.data[i].endTime >= time
          && friends[j].accepter_id === resObj.data[i].UserId) {
          setCurrentEvent(resObj.data[i]);
          setMustCreateEvent(false);
          // else determine if there are any happening at time PRIVATE
        } else {
          setMustCreateEvent(true)
        }
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
      // console.log(response.data.results[0].formatted_address, '<-----res from reverse geocoding fetch')
      setCurrentAddress(response.data.results[0].formatted_address)
    })
    .catch((err) => {
      console.error('Failed to fetch address: ', err);
    })
}



useEffect(() => {
  getFriendList();
  publicEventCheck(user.geolocation, today, timeNow);
  getCurrentAddress();
}, [])

useEffect(() => {
  // check for private events once friends list has been gotten
  privateEventCheck(user.geolocation, today, timeNow)
}, [friends])

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
      currentAddress={currentAddress}
      friends={friends}/>
    </div>
  )
};

export default CreateReel;
