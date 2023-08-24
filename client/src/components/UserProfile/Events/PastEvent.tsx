import * as React from 'react';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
dayjs.extend(localizedFormat)

dayjs().format('L LT')

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

  let eventDate = dayjs(event.date + event.time).format('MM/DD/YYYY, h:mm A');
  const eventTime = eventDate.slice(eventDate.indexOf(' '))
  eventDate = eventDate.slice(0, eventDate.indexOf(','));

  const endDate = dayjs(event.date + event.endTime).format('MM/DD/YYYY, h:mm A');
  const eventEndTime = endDate.slice(endDate.indexOf(' '))

  return (
    <div className='column-md-2'>
      <div className='eventCard'>
        <div className='eventCardDetails'>
          <h3 className='eventNameInput'>
            {event.name}
          </h3>
          <br></br>
          Date: {eventDate}
          <br></br>
          Began: {eventTime}
          <br></br>
          Ended: {eventEndTime}
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
