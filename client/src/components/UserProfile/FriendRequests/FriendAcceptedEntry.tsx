import * as React from 'react';
import Fab from '@mui/material/Fab';
import Tooltip from '@mui/material/Tooltip';
import Zoom from '@mui/material/Zoom';
import RemoveOutlinedIcon from '@mui/icons-material/RemoveOutlined';

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
};

const FriendAcceptedEntry: React.FC<Props> = ({
  user,
  friend,
  rejectFriendship,
}) => {
  return (
    <>
      <div className='friendRequest-container'>
        <h2 className='friendName'>{friend?.id}</h2>
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
                  rejectFriendship(friend?.accepter_id, friend?.updatedAt)
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

export default FriendAcceptedEntry;
