 /* eslint-disable @typescript-eslint/no-explicit-any */
 import * as React from 'react';
 import { useState, useEffect } from "react";
 import axios from 'axios';
 import EventLocationSearch from './EventLocationSearch';
 import ConflictingEvent from './ConflictingEvent';
 import dayjs from 'dayjs';
 import localizedFormat from 'dayjs/plugin/localizedFormat';

  dayjs.extend(localizedFormat)

  dayjs().format('L LT')

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
   },
   mustCreateEvent: boolean,
   updateMustCreateEvent: () => void,
   updateEventId: (newId: number) => void,
   togglePopUp: () => void,
   updateBusinessEventCreated: () => void,
   currentAddress: string,
   eventIsPublic: boolean,
   friends: {
    id: number;
    status: string;
    requester_id: number;
    accepter_id: number;
  }[];
  clear: boolean,
  resetClear: () => void
 }

 const NewEventForm: React.FC<Props> = ({
  user, mustCreateEvent, updateMustCreateEvent, updateEventId, togglePopUp,
  updateBusinessEventCreated, currentAddress, eventIsPublic, friends,
  clear, resetClear
}) => {

 const [eventName, setEventName] = useState('');
 // event location is users current location by default, until/ unless they select an address
 const [eventLocation, setEventLocation] = useState(user.geolocation);
 const [address, setAddress] = useState(currentAddress)
 const [eventDate, setEventDate] = useState('');
 const [eventTime, setEventTime] = useState('');
 const [endTime, setEndTime] = useState('');
 const [twentyOne, setTwentyOne] = useState(false);
 const [noConflicts, setNoConflicts] = useState(true);
 const [conflictingEvent, setConflictingEvent] = useState({
  id: 0,
  name: 'Conflict',
  rsvp_count: 0,
  date: '',
  time: '',
  endTime: '',
  geolocation: '',
  address: '',
  twenty_one: false,
  isPublic: false,
  createdAt: '',
  updatedAt: '',
  PlaceId: 0
});

// handle input for new event name
const handleEventName = (e: any) => {
 setEventName(e.target.value);

}
// handle input for new event date
const handleEventDate = (e: any) => {
 setEventDate(e.target.value)
}

// handle input for new event time
const handleEventTime = (e: any) => {
 setEventTime(e.target.value)
}

const handleEndTime = (e: any) => {
 setEndTime(e.target.value)
}

// handle changing to 21 +
const handleTwentyOne = () => {
 if (!twentyOne) {
   setTwentyOne(true)
 } else {
   setTwentyOne(false)
 }
}

// function to set event location
const handleLocation = (geolocation: any) => {
  setEventLocation(geolocation)
};

const handleAddress = (address: any) => {
  setAddress(address)
}

// check to see if there are any PUBLIC events happening at location date and time
const eventCheck = (location: any, date: any) => {
  axios.get(`/events/${location}/${date}`)
    .then((resObj) => {
      // response object is event happening at LOCATION/ DATE; must check to see if theres one happening at TIME
      // iterate through LOCATION/ DATE events
      // ok, right now we have a list of ALL events, pub or priv
      // we want: all public events AND private events IF the creator is our friend
      for (let i = 0; i < resObj.data.length; i++) {
        //determine if any are happening at time PUBLIC
        // if inputted events START TIME is BETWEEN found events START & END times => conflict
        // or
        // if inputted events END TIME is BETWEEN found events START & END times => conflict
        if (eventTime >= resObj.data[i].time && eventTime <= resObj.data[i].endTime ||
          endTime >= resObj.data[i].time && endTime <= resObj.data[i].endTime) {
            // determine if public
            if (resObj.data[i].isPublic) {
              setConflictingEvent(resObj.data[i]);
              setNoConflicts(false)
            } else {
              // iterate through friends
              for (let j = 0; j < friends.length; j++) {
                // determine if found event is that of friends
                if (friends[j].accepter_id === resObj.data[i].UserId) {
                  setConflictingEvent(resObj.data[i]);
                  setNoConflicts(false)
                }
              } // or if it is their own event
              if (user.id === resObj.data[i].UserId) {
                setConflictingEvent(resObj.data[i]);
                setNoConflicts(false)
              }
            }
        } else {
          setNoConflicts(true)
        }
      }
      if (resObj.data.length === 0) {
        setNoConflicts(true)
      }
    })
    .catch((err) => {
      setNoConflicts(true);
      console.log('No events for this day/location found: ', err)
    })
}

// check for conflicting events when eventDate or location is entered
useEffect(() => {
  if (eventTime !== '' && endTime !== '' && eventDate !== '' && eventLocation !== '') {
    eventCheck(eventLocation, eventDate);
  }
}, [eventTime, endTime, eventDate, eventLocation])

useEffect(() => {
  setAddress(currentAddress)
}, [currentAddress])

// ADD LOGIC TO PREVENT POSTING IF EVENT IS ALREADY HERE
// ADD WAY OF NOTIFYING USER THAT EVENT CREATION WAS SUCCESSFUL
// patch request to update event in la database
const createEvent = async () => {

  if (noConflicts) {
    axios.post('/events/create', {
      name: eventName,
      date: eventDate,
      time: eventTime,
      endTime: endTime,
      geolocation: eventLocation,
      address: address,
      twenty_one: twentyOne,
      isPublic: eventIsPublic,
      UserId: user.id
    })
    .then((res) => {
      updateEventId(res.data.event.id)
      updateMustCreateEvent();
      updateBusinessEventCreated();
      togglePopUp();
    })
    .catch((err) => {
      console.error('Failed to axios POST event: ', err)
    })
  } else {
    console.log('conflicting event!: ', conflictingEvent)
  }
}
  // reset all event detail values if clear gets set to true
  useEffect(() => {
    setEventName('');
    setEventLocation(user.geolocation);
    setAddress(currentAddress);
    setEventDate('');
    setEventTime('');
    setEndTime('');
    setTwentyOne(false);
    resetClear();
    console.log('reset event details');
  }, [clear])

   return (
     <div
       id='event-form'
       className='popUpEventForm'
       style={{justifyContent: 'center'}}
       >
         <textarea
         style={{fontWeight: '400'}}
         className='eventNameInput'
         placeholder='Event Name'
         id='eventName'
         value={eventName}
         onChange={handleEventName}>
         </textarea>
         Address: &#160;<EventLocationSearch
         handleLocation={handleLocation}
         handleAddress={handleAddress}
         currentAddress={currentAddress}/>
          Date: &#160;
         <input
         className='eventDetailInput'
         id='eventDate'
         value={eventDate}
         onChange={handleEventDate}
         type="date">
         </input>
         <br></br>
          Begins: &#160;
         <input
         className='eventDetailInput'
         id='eventTime'
         value={eventTime}
         onChange={handleEventTime}
         type='time'>
         </input>
         <br></br>
         Ends: &#160;
         <input
         className='eventDetailInput'
         id='endTime'
         value={endTime}
         onChange={handleEndTime}
         type='time'>
         </input>
         <br></br>
         <label
         htmlFor='twentyOne'>
         21+
         </label>
         &#160;
         <input
         id='twentyOne'
         type='checkbox'
         checked={twentyOne}
         onChange={handleTwentyOne}>
         </input>
         <br></br>
         <br></br>
         {noConflicts ?
         <div style={{alignItems: 'center'}}>
          <br></br>
         <button
         className='save-event-detail-button'
         type='submit'
         onClick={createEvent}>
           Save
         </button>
         </div> :
         (<ConflictingEvent
     conflictingEvent={conflictingEvent} />)
        }
     </div>
   )
 };

 export default NewEventForm;
