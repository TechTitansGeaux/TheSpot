import * as React from 'react';
import './likes.css';

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

  return (
    <>
    <li className='like-entry'>
      <span className='like-name'>{like.User.displayName}</span>{` liked your reel '${like.Reel.text}'`}
      </li>
      <hr></hr>
    </>
  );
};

export default LikesEntry;