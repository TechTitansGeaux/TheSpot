import React from 'react';
import RsvpSharpIcon from '@mui/icons-material/RsvpSharp';
import Fab from '@mui/material/Fab';
import Tooltip from '@mui/material/Tooltip';
import Zoom from '@mui/material/Zoom';
import { useState } from 'react';

type Props = {
  reel: Reel;
  removeRsvps: any;
};

type Reel = {
  id: string;
  public_id: number;
  url: string;
  text?: string;
  like_count?: number;
  UserId: number;
  EventId?: number;
  User: User;
  Event: Event;
};

type User = {
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

type Event = {
  id: number;
  name: string;
  rsvp_count: number;
  date: string;
  time: string;
  endTime: string;
  geolocation: string;
  address: string;
  twenty_one: boolean;
  public: boolean;
  createdAt: string;
  updatedAt: string;
  PlaceId: 1;
};

const UnRsvp: React.FC<Props> = ({
  reel,
  removeRsvps
}) => {
  const [click, setClick] = useState(false);

  const handleRemoveRsvpClick = (EventId: number) => {
    if (!click) {
      console.log('RSVP click on Event id', EventId);
      setClick(!click);
      removeRsvps(EventId);
    }
  };

  return (
    <>
      <Fab
        style={{
          transform: 'scale(1)',
          backgroundColor: 'white',
          boxShadow: 'none',
        }}
        size='large'
        aria-label='rsvp event'
        disabled={click}
      >
        <Tooltip
          title='Remove RSVP'
          TransitionComponent={Zoom}
          placement='top'
          PopperProps={{
            sx: {
              '& .MuiTooltip-tooltip': {
                backgroundColor: '#0b0113',
                border: 'solid #F5FCFA 1px',
                color: '#F5FCFA',
              },
            },
          }}
        >
          <RsvpSharpIcon
            name='RSVP Button'
            aria-label='RSVP Button'
            style={{ transform: 'scale(2)' }}
            color={!click ? 'secondary' : 'primary'}
            onClick={() => handleRemoveRsvpClick(reel?.EventId)}
          />
        </Tooltip>
      </Fab>
    </>
  );
};

export default UnRsvp;
