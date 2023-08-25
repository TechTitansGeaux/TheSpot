import * as React from 'react';
import FollowingEntry from './FollowingEntry';
import FollowedEntry from './FollowedEntry';
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
  const [followed, setFollowed] = useState([]);
  const [following, setFollowing] = useState([]);
  //GET request to retreive all followed users

  const getAllFollowing = () => {
    axios
      .get('/followers')
      .then(({ data }) => {
        console.log('data from getAllFollowed', data);
        data.map((row: any) => {
          if (!following.includes(row.follower_id)) {
           setFollowed((prev) => [...prev, row.follower_id]);
          }
        });
        // console.log('All followed users retrieved AXIOS GET', data);
      })
      .catch((err) => {
        console.error('AXIO get all followed users FAILED', err);
      });
  };

  const getAllFollowed = () => {
    axios
      .get('/followers')
      .then(({ data }) => {
        console.log('data from getAllFollowed', data);
        data.map((row: any) => {
          if (!followed.includes(row.followedUser_id)) {
            setFollowing((prev) => [...prev, row.followedUser_id]);
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

  useEffect(() => {
    getAllFollowing();
  }, []);

  console.log('followed ==>', followed);
  console.log('following ==>', following);
  console.log('allUsers ==>', allUsers);
  return (
    <>
      <div className='container-full-w'>
        <h1 className='profile-title'>Followers</h1>
        <FollowedEntry user={user} allUsers={allUsers} followed={followed} />
      </div>
      <div className='container-full-w'>
        <h1 className='profile-title'>Following</h1>
        <FollowingEntry user={user} allUsers={allUsers} following={following} />
      </div>
    </>
  );
};

export default FollowersList;
