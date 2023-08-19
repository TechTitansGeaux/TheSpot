import * as React from 'react';
import { useState, useEffect } from 'react';
import UpcomingEvent from './UpcomingEvent';
import PastEvent from './PastEvent';
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

  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [pastEvents, setPastEvents] = useState([]);
  const [showPast, setShowPast] = useState(false);

  const todayRaw = new Date().toDateString();
  const today = Date.parse(todayRaw);

  // function to get all of user's events
  const getMyEvents = () => {
    axios.get('/events/userEvents')
      .then((res) => {
        // upcoming event container
        let upcomingArr = [];
        // past event container
        let pastArr = [];
        // iterate through events
        for (let i = 0; i < res.data.length; i++) {
          // determine if THEIR date is before ot after today
          if (Date.parse(res.data[i].date) >= today) {
            // push into upcoming array
            upcomingArr.push(res.data[i])
          } else {
            pastArr.push(res.data[i])
          }
        }
        // sort upcoming events by soonest coming up
        upcomingArr = upcomingArr.sort((a, b) => Date.parse(a.date) - Date.parse(b.date));
        // set upcoming events
        setUpcomingEvents(upcomingArr);
        pastArr = pastArr.sort((a, b) => Date.parse(a.date) - Date.parse(b.date))
        setPastEvents(pastArr);
      })
      .catch((err) => {
        console.error('Failed to axios GET user events: ', err);
      })
  }
  // call my my events once when page is rendered
  useEffect(() => {
    getMyEvents();
  }, [])

  console.log(upcomingEvents, '<-----upcoming events');
  console.log(pastEvents, '<------past events')

  const showPastView = () => {
    setShowPast(true);
  }
  const showUpcomingView = () => {
    setShowPast(false);
  }

  return (
    <div className='flex-container-events'>
      {/* <h3 style={{color: '#f0f465'}}>Events</h3> */}
      <div
      className='eventTypeContainer'>
        <h3
        onClick={showUpcomingView}
        >
          Upcoming &#160;| &#160;</h3>
        <h3
        onClick={showPastView}>
           Past</h3>
      </div>
      <div className="event-cards-row">
        {!showPast && upcomingEvents.map((event) => {
          return (
            <UpcomingEvent
            event={event}
            key={'event' + event.id}/>
          )
        })}
        {showPast && pastEvents.map((event) => {
          return (
            <PastEvent
            event={event}
            key={'event' + event.id}/>
          )
        })}
      </div>
    </div>
  );
};

export default EventsList;
