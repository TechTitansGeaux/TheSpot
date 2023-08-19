import * as React from 'react';
import CreateIcon from '@mui/icons-material/Create';

type Props = {
  event: {
    PlaceId: string,
    UserId: number,
    createdAt: string,
    date: string,
    endTime: string,
    geolocation: string,
    id: number,
    name: string,
    rsvp_count: number,
    time: string,
    twenty_one: boolean,
    updatedAt: string
  }
}
const UpcomingEvent: React.FC<Props> = ({event}) => {
  return (
    <div className='column-md-2'>
      <div className='eventCard'>
        <div>
          <h3 style={{color: '#f0f465'}}>
            {event.name}
          </h3>
          <div className='eventCardDetails'>
          <br></br>
          Date: {event.date}
          <br></br>
          Begins: {event.time}
          <br></br>
          Ends: {event.endTime}
          <br></br>
          RSVPs: {event.rsvp_count}
          <br></br>
          {event.twenty_one && '21+'}
        </div>
        </div>
        <div className='editIcon'>
          <CreateIcon />
        </div>
      </div>
    </div>
  );
};

export default UpcomingEvent;
