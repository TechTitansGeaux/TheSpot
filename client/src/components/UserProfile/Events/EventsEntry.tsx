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
const EventsEntry: React.FC<Props> = ({event}) => {
  return (
    <div>
      {event.name}
    </div>
  );
};

export default EventsEntry;
