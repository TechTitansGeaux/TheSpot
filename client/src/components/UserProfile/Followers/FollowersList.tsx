import * as React from 'react';
import FollowersEntry from './FollowersEntry';
import axios from 'axios';
import { useEffect, useState } from 'react';

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
};


const FollowersList: React.FC<Props> = ({ user, allUsers }) => {
  const [follower, setFollower] = useState([]);
  //GET request to retreive all followed users

  const getAllFollowed = () => {
    axios
      .get('/followers')
      .then(({ data }) => {
        data.map((row: any) => {
          if (!follower.includes(row.followerUser_id)) {
            setFollower((prev) => [...prev, row.followerUser_id]);
          }
        });
        // console.log('All followed users retrieved AXIOS GET', data);
      })
      .catch((err) => {
        console.error('AXIO get all followed users FAILED', err);
      });
  };

  useEffect(() => {
    getAllFollowed();
  }, []);

  console.log('followed', follower);
  return (
    <div className='container-full-w'>
      <h1 className='profile-title'>Followers</h1>
      <FollowersEntry user={user} allUsers={allUsers} follower={follower} />
    </div>
  );
}

export default FollowersList;