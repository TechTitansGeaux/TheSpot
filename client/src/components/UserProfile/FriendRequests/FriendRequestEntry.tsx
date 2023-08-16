import * as React from 'react';
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import Tooltip from '@mui/material/Tooltip';
import Zoom from '@mui/material/Zoom';
import AddIcon from '@mui/icons-material/Add';
import RemoveOutlinedIcon from '@mui/icons-material/RemoveOutlined';

type Props = {
  approveFriendship: any;
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
    accepter_id: number;
    createdAt: number;
    id: number;
    requester_id: number;
    status: string;
    updatedAt: Date;
  };
  friend: any;
};

const FriendRequestEntry: React.FC<Props> = ({
  user,
  approveFriendship,
  pendingFriend,
  friend
}) => {
  return (
    <>
      <div className='friendRequest-container'>
        <h2 className='friendName'>{pendingFriend?.id}</h2>
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
              arrow
            >
              <AddIcon
                sx={{ width: 20, height: 20 }}
                onClick={() => approveFriendship(pendingFriend.accepter_id)}
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
              arrow
            >
              <RemoveOutlinedIcon
                className='rejectFriend-btn'
                onClick={() => console.log('delete request')}
              />
            </Tooltip>
          </Fab>
        </div>
      </div>
      <hr></hr>
    </>
  );
};

export default FriendRequestEntry;
