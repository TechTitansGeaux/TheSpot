import React from 'react';

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
  followed: number[];
};

const FollowedEntry: React.FC<Props> = ({ user, allUsers, followed }) => {
  const followedName = allUsers?.reduce((name: string, otherUser: any) => {
    if (followed.includes(otherUser?.id)) {
      name = otherUser?.displayName;
    }
    return name;
  }, '');

  const followedIcon = allUsers?.reduce((icon: string, otherUser: any) => {
    if (followed.includes(otherUser?.id)) {
      icon = otherUser?.mapIcon;
    }
    return icon;
  }, '');

  return (
    <>
      {user?.displayName !== followedName && followed?.length > 0 ? (
        <div className='friendRequest-container'>
          <img className='follow-icon' src={followedIcon} alt={followedName} />
          <h2 className='friendName'>{followedName}</h2>
        </div>
      ) : (
        user?.displayName !== followedName && (
          <div className='friendRequest-container'>
            <img
              className='follow-icon'
              src={followedIcon}
              alt={followedName}
              style={{
                width: '40px',
                height: '40px',
                marginRight: '10px',
              }}
            />
            <h2 className='friendName'>{followedName}</h2>
          </div>
        )
      )}
      <hr></hr>
    </>
  );
};

export default FollowedEntry;
