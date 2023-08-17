import * as React from 'react';
import LikesEntry from './LikesEntry';

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
};
const LikesList: React.FC<Props> = ({user}) => {
  return (
    <div className='container-full-w'>
      <h1>LikesList</h1>
      <LikesEntry />
    </div>
  );
};

export default LikesList;
