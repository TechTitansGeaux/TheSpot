import * as React from 'react';


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
  user: User;
  allUsers: [User];
  following: number[];
};

const FollowingEntry: React.FC<Props> = ({ user, allUsers, following }) => {

  const followingName = allUsers?.reduce((name: string, otherUser: any) => {
    if (following.includes(otherUser?.id)) {
      name = otherUser?.displayName;
    }
    return name;
  }, '');

  const followingIcon = allUsers?.reduce((icon: string, otherUser: any) => {
    if (following.includes(otherUser?.id)) {
      icon = otherUser?.mapIcon;
    }
    return icon;
  }, '');

  return (
    <>
      {user?.displayName !== followingName && following?.length > 0 ? (
        <div className='friendRequest-container'>
          <img
            className='follow-icon'
            src={followingIcon}
            alt={followingName}
            style={{
              width: '40px',
              height: '40px',
              marginRight: '10px',
            }}
          />
          <h2 className='friendName'>{followingName}</h2>
        </div>
      ) : (
        user?.displayName !== followingName && <div className='friendRequest-container'>
          <img
            className='follow-icon'
            src={followingIcon}
            alt={followingName}
          />
          <h2 className='friendName'>{followingName}</h2>
        </div>
      )}
      <hr></hr>
    </>
  );
};

export default FollowingEntry;