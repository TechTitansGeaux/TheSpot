import * as React from 'react';
import Fab from '@mui/material/Fab';
import Tooltip from '@mui/material/Tooltip';
import Zoom from '@mui/material/Zoom';
import AddIcon from '@mui/icons-material/Add';
import RemoveOutlinedIcon from '@mui/icons-material/RemoveOutlined';



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
};

const FriendRequestEntry: React.FC<Props> = ({
  user,
  approveFriendship,
  rejectFriendship,
  pendingFriend,
  allUsers
}) => {

  const pendingFriendConfirmed = allUsers.reduce((name: String, otherUser: any) => {
    if (otherUser?.id === pendingFriend?.accepter_id) {
      name = otherUser.displayName;
      console.log('friend displayName:', otherUser.displayName);
    }
    return name;
  }, '');

  return (
    <>
      <div className='friendRequest-container'>
        <h2 className='friendName'>{pendingFriendConfirmed}</h2>
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
                    backgroundColor: 'transparent',
                    border: 'solid #F5FCFA 1px',
                    color: '#F5FCFA',
                  },
                },
              }}
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
              PopperProps={{
                sx: {
                  '& .MuiTooltip-tooltip': {
                    backgroundColor: 'transparent',
                    border: 'solid #F5FCFA 1px',
                    color: '#F5FCFA',
                  },
                },
              }}
            >
              <RemoveOutlinedIcon
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
      <hr></hr>
    </>
  );
};

export default FriendRequestEntry;
