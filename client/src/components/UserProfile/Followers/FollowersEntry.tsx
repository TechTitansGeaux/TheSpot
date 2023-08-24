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
  follower: any;
};

const FollowersEntry: React.FC<Props> = ({user, allUsers, follower}) => {

  // const followerName = allUsers.reduce((name: string, otherUser: any) => {
  //   if (otherUser?.id === follower?.requester_id) {
  //     // CHANGE to requester_id
  //     name = otherUser.displayName;
  //   }
  //   return name;
  // }, '');

  // const followerIcon = allUsers.reduce((icon: string, otherUser: any) => {
  //   if (otherUser?.id === follower?.requester_id) {
  //     // CHANGE to requester_id
  //     icon = otherUser.mapIcon;
  //   }
  //   return icon;
  // }, '');

  return (
    <>
      <div className='friendRequest-container'>
        <img
          // src={followerIcon}
          // alt={followerName}
          style={{
            width: '40px',
            height: '40px',
            marginRight: '10px',
          }}
        />
        <h2 className='friendName'>{'followerName'}</h2>
      </div>
      <hr></hr>
    </>
  );
};

export default FollowersEntry;