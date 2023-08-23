import * as React from 'react';

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
const PastEvent: React.FC<Props> = ({event}) => {
  return (
    <div className='column-md-2'>
      <div className='eventCard'>
        <div className='eventCardDetails'>
          <h3 className='eventNameInput'>
            {event.name}
          </h3>
          <br></br>
          Date: {event.date}
          <br></br>
          Began: {event.time}
          <br></br>
          Ended: {event.endTime}
          <br></br>
          RSVPs: {event.rsvp_count}
          <br></br>
          21+ {event.twenty_one}
        </div>
      </div>
    </div>
  );
};

export default PastEvent;
