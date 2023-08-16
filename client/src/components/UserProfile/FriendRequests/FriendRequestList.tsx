import * as React from 'react';
import FriendRequestEntry from './FriendRequestEntry';
import { useState, useEffect } from 'react';
import axios from 'axios';

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

const FriendRequestList: React.FC<Props> = ({ user }) => {
  const [pendingFriends, setPendingFriends] = useState([]); // pending friend list for current user
  const [friends, setFriends] = useState([]); // approved friend list for current user

  // create axios get request to get pending friends
  const getPendingFriendList = () => {
    axios
      .get(`/feed//friendlist/pending`)
      .then((response) => {
        //console.log('friends response.data:', response.data);
        setPendingFriends(response.data);
      })
      .catch((err) => {
        console.error('Could not GET friends:', err);
      });
  };

  // create axios get request to get approved friends
  const getFriendList = () => {
    axios
      .get(`/feed/friendlist`)
      .then((response) => {
        //console.log('friends response.data:', response.data);
        setFriends(response.data);
      })
      .catch((err) => {
        console.error('Could not GET friends:', err);
      });
  };

  useEffect(() => {
    getPendingFriendList();
    getFriendList();
  }, []);

  // PUT request update friendship from 'pending' to 'approved'
  const approveFriendship = (friend: number) => {
    console.log('friendship approved');
    axios
      .put('/friends', {
        requester_id: friend,
      })
      .then((data) => {
        console.log('Friend request approved PUT', data);
      })
      .catch((err) => {
        console.error('Friend PUT request axios FAILED:', err);
      });
  };

  return (
    <>
      <div className='container-full-w'>
        <h1>Pending Friend Requests</h1>
        {pendingFriends !== undefined &&
          pendingFriends.map((pendingFriend) => {
            return (
              <FriendRequestEntry
                key={pendingFriend.id}
                friend
                pendingFriend={pendingFriend}
                user={user}
                approveFriendship={approveFriendship}
              />
            );
          })}
      </div>
      <div className='container-full-w'>
        {/* <h1>My Friends</h1>
        {friends.length !== 0 &&
          friends.map((friend) => {
            return (
              <FriendRequestEntry
                key={friend.id}
                friend={friend}
                pendingFriends={friend}
                user={user}
                approveFriendship={approveFriendship}
              />
            );
          })} */}
      </div>
    </>
  );
};

export default FriendRequestList;
