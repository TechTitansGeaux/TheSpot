import React from 'react';
import Fab from '@mui/material/Fab';
import Tooltip from '@mui/material/Tooltip';
import Zoom from '@mui/material/Zoom';
import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';
import CheckIcon from '@mui/icons-material/Check';

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
  pendingFriend: {
    id: number;
    status: string;
    requester_id: number;
    accepter_id: number;
    createdAt: string;
    updatedAt: string;
  };
  approveFriendship: any;
  rejectFriendship: any;
  allUsers: [User];
  // reject: boolean;
};

const FriendRequestEntry: React.FC<Props> = ({
  user,
  approveFriendship,
  rejectFriendship,
  pendingFriend,
  allUsers,
  // reject,
}) => {
  const pendingFriendName = allUsers.reduce((name: string, otherUser: any) => {
    if (otherUser?.id === pendingFriend?.requester_id) {
      // CHANGE to requester_id
      name = otherUser?.displayName;
    }
    return name;
  }, '');

  const pendingFriendIcon = allUsers.reduce((icon: string, otherUser: any) => {
    if (otherUser?.id === pendingFriend?.requester_id) {
      // CHANGE to requester_id
      icon = otherUser?.mapIcon;
    }
    return icon;
  }, '');

  return (
    <>
      <div className='friendRequest-container'>
        <img
          src={pendingFriendIcon}
          alt={pendingFriendName}
          style={{
            width: '40px',
            height: '40px',
            marginRight: '10px',
          }}
        />
        <h2 className='friendName'>{pendingFriendName}</h2>
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
              title='Accept Friend'
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
              <CheckIcon
                sx={{ width: 20, height: 20 }}
                onClick={() => approveFriendship(pendingFriend?.requester_id)}
              />
            </Tooltip>
          </Fab>
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
              title='Reject Request'
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
                  rejectFriendship(
                    pendingFriend.accepter_id,
                    pendingFriend?.updatedAt
                  )
                }
              />
            </Tooltip>
          </Fab>
        </div>
      </div>
      <hr className='line'></hr>
    </>
  );
};

export default FriendRequestEntry;
