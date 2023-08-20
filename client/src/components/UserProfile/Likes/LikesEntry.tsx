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
  allUsers: any;
  like: any;
};

const LikesEntry: React.FC<Props> = ({user, allUsers, like}) => {

  const likeName = allUsers.reduce((name: String, otherUser: any) => {
    if (otherUser?.id === like?.UserId) {
      name = otherUser.displayName;
    }
    return name;
  }, '');
  
  return (
    <li>
      {`${likeName} liked your reel`}
    </li>
  );
};

export default LikesEntry;