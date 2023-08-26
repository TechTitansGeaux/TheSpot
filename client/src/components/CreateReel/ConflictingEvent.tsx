 /* eslint-disable @typescript-eslint/no-explicit-any */
 import * as React from 'react';
 import ErrorIcon from '@mui/icons-material/Error';
 import { useState, useEffect } from "react";

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
  return (
    <div>
      <ErrorIcon />&#160;There is already an event at this location on this date from
      {conflictingEvent.time} to {conflictingEvent.endTime}
  </div>
  )
 }

 export default ConflictingEvent;
 