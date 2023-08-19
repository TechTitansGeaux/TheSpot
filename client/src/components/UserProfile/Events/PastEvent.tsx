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
    <div className='eventCard'>
      {event.name}
    </div>
  );
};

export default PastEvent;
