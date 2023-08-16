import * as React from 'react';
import FriendRequestEntry from './FriendRequestEntry';
import FriendAcceptedEntry from './FriendAcceptedEntry';
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
  const [notifBool, setNotifBool] = useState(false);

  // create axios get request to get pending friends
  const getPendingFriendList = () => {
    axios
      .get(`/feed/friendlist/pending`)
      .then((response) => {
        setPendingFriends(response.data);
        if (pendingFriends.length !== 0) {
          setNotifBool(true);
        } else {
          setNotifBool(false);
        }
        //console.log('friends response.data:', response.data);
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

  const rejectFriendship = (friend: number, time: Date) => {
    axios
      .delete(`/friends/:${friend}`, {
        data: { updatedAt: time },
      })
      .then((response) => {
        console.log('friendship deleted', response.data);
      })
      .catch((err) => {
        console.error('Delete friendship FAILED axios request:', err);
      });
  };

  useEffect(() => {
    const controller = new AbortController();
    getPendingFriendList();
    getFriendList();
    // aborts axios request when component unmounts
    return () => controller?.abort();
  }, [friends]);

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
        <h1 className='profile-title'>Pending Friend Requests</h1>
        {pendingFriends !== undefined &&
          pendingFriends.map((pendingFriend) => {
            return (
              <FriendRequestEntry
                key={pendingFriend.id}
                pendingFriend={pendingFriend}
                notifBool={notifBool}
                user={user}
                approveFriendship={approveFriendship}
              />
            );
          })}
      </div>
      <div className='container-full-w'>
        <h1 className='profile-title'>My Friends</h1>
        {friends.length !== 0 &&
          friends.map((friend) => {
            return (
              <FriendAcceptedEntry
                key={friend.id}
                friend={friend}
                user={user}
                rejectFriendship={rejectFriendship}
              />
            );
          })}
      </div>
    </>
  );
};

export default FriendRequestList;
