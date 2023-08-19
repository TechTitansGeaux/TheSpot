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
const UpcomingEvent: React.FC<Props> = ({event}) => {
  return (
    <div className='column-md-2'>
      <div className='eventCard'>
        <h3>
          {event.name}
        </h3>
      </div>
    </div>
  );
};

export default UpcomingEvent;
