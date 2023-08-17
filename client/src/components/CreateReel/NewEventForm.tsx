  /* eslint-disable @typescript-eslint/no-explicit-any */
  import * as React from 'react';
  import { useState } from "react";
  import axios from 'axios';

  const NewEventForm = () => {

  const [eventName, setEventName] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventTime, setEventTime] = useState('');
  const [twentyOne, setTwentyOne] = useState(false);

// handle input for new event name
const handleEventName = (e: any) => {
  setEventName(e.target.value)
}
// handle input for new event date
const handleEventDate = (e: any) => {
  setEventName(e.target.value)
}

// handle input for new event time
const handleEventTime = (e: any) => {
  setEventName(e.target.value)
}

// handle changing to 21 +
const handleTwentyOne = () => {
  if (!twentyOne) {
    setTwentyOne(true)
  } else {
    setTwentyOne(false)
  }
}

// patch request to update event in la database
const updateEvent = () => {
  axios.post('/events/create', {
    name: eventName,
    // date: eventDate
    // geolocation: user.geolocation,

  })
  .then(() => {

  })
  .catch((err) => {
    console.error('Failed to axios PATCH event: ', err)
  })
}


console.log(twentyOne, '<-------21')

    return (
      <div
                id='event-form'
                className='popUpEventForm'
                >
                  <label
                  htmlFor='eventName'>
                  Event name:
                  </label>
                  <br></br>
                  <input
                  id='eventName'
                  value={eventName}
                  onChange={handleEventName}
                  type='text'>
                  </input>
                  <br></br>
                  <label
                  htmlFor='eventDate'>
                    Date:
                  </label>
                  <br></br>
                  <input
                  id='eventDate'
                  value={eventDate}
                  onChange={handleEventDate}
                  placeholder='MM/DD/YYYY'
                  type='text'>
                  </input>
                  <br></br>
                  <label
                  htmlFor='eventTime'>
                    Time:
                  </label>
                  <br></br>
                  <input
                  id='eventTime'
                  value={eventTime}
                  onChange={handleEventTime}
                  placeholder='0:00 AM/PM'
                  type='text'>
                  </input>
                  <br></br>
                  <label
                  htmlFor='twentyOne'>
                  21+
                  </label>
                  <br></br>
                  <input
                  id='twentyOne'
                  type='checkbox'
                  checked={twentyOne}
                  onChange={handleTwentyOne}>
                  </input>
                  <br></br>
                  <button
                  type='submit'
                  onClick={updateEvent}>
                    Save
                  </button>
              </div>
    )
  };

  export default NewEventForm;
