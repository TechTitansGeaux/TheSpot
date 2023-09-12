import React from 'react';
import Fab from '@mui/material/Fab';
import Tooltip from '@mui/material/Tooltip';
import Zoom from '@mui/material/Zoom';
import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';

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
  friend: {
    id: number;
    status: string;
    requester_id: number;
    accepter_id: number;
    createdAt: Date;
    updatedAt: Date;
  };
  rejectFriendship: any;
  allUsers: any;
};

const FriendAcceptedEntry: React.FC<Props> = ({
  user,
  friend,
  rejectFriendship,
  allUsers,
  // reject
}) => {
  const friendName = allUsers.reduce((name: String, otherUser: any) => {
    if (otherUser?.id === friend?.accepter_id) {
      // CHANGE to requester_id
      name = otherUser?.displayName;
    }
    return name;
  }, '');

  const friendIcon = allUsers.reduce((icon: string, otherUser: any) => {
    if (otherUser?.id === friend?.accepter_id) {
      // CHANGE to requester_id
      icon = otherUser?.mapIcon;
    }
    return icon;
  }, '');

  return (
    <React.Fragment>
      {
        <div className='friendRequest-container'>
          <img
            src={friendIcon}
            alt={friendName}
            style={{
              width: '40px',
              height: '40px',
              marginRight: '10px',
            }}
          />
          <h2 className='friendName'>{friendName}</h2>
          <div className='btn-container'>
            <Fab
              style={{
                transform: 'scale(0.8)',
                borderColor: 'white',
                borderStyle: 'solid',
                borderWidth: 1,
              }}
              size='small'
              color='primary'
              aria-label='add'
              disabled={false}
            >
              <Tooltip
                title='Unfriend'
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
                <ClearOutlinedIcon
                  className='rejectFriend-btn'
                  onClick={() =>
                    rejectFriendship(friend?.accepter_id, friend?.updatedAt)
                  }
                />
              </Tooltip>
            </Fab>
          </div>
        </div>
      }
      <hr className='line'></hr>
    </React.Fragment>
  );
};

export default FriendAcceptedEntry;
