 /* eslint-disable @typescript-eslint/no-explicit-any */
 import * as React from 'react';
 import ErrorIcon from '@mui/icons-material/Error';
 import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
dayjs.extend(localizedFormat)

dayjs().format('L LT')

 type Props = {
  conflictingEvent: {
    id: number;
    name: string;
    rsvp_count: number;
    date: string;
    time: string;
    endTime: string;
    geolocation: string;
    address: string;
    twenty_one: boolean;
    isPublic: boolean;
    createdAt: string;
    updatedAt: string;
    PlaceId: number;
  }
 }

 const ConflictingEvent: React.FC<Props> = ({conflictingEvent}) => {

  const eventDate = dayjs(conflictingEvent.date + conflictingEvent.time).format('MM/DD/YYYY, h:mm A');
  const eventTime = eventDate.slice(eventDate.indexOf(' '))

  const endDate = dayjs(conflictingEvent.date + conflictingEvent.endTime).format('MM/DD/YYYY, h:mm A');
  const eventEndTime = endDate.slice(endDate.indexOf(' '))

  return (
    <div style={{fontSize: 'small'}}>
      <ErrorIcon fontSize='small'/>&#160;There is already an event at this location on this date from&#160;
      {eventTime} to {eventEndTime}
  </div>
  )
 }

 export default ConflictingEvent;
