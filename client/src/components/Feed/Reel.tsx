import * as React from 'react';
import { useState, useEffect, useRef, createRef } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
// import { useLocation } from 'react-router-dom';
import { setAuthUser, setIsAuthenticated } from '../../store/appSlice';
import ReelItem from './ReelItem';

// const ReelItem = React.lazy(() => import('./ReelItem'));

type Props = {
  reels: {
    id: string;
    public_id: number;
    url: string;
    text?: string;
    like_count?: number;
    UserId: number;
    EventId?: number;
    User: User;
    Event: Event;
  }[];
  AddFriend?: React.ReactNode | React.ReactNode[];
  friends: {
    id: number;
    status: string;
    requester_id: number;
    accepter_id: number;
  }[];
};

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

type Event = {
  id: number;
  name: string;
  rsvp_count: number;
  date: string;
  geolocation: string;
  twenty_one: boolean;
  createdAt: string;
  updatedAt: string;
  PlaceId: 1;
};

const Reel: React.FC<Props> = ({ reels }) => {
  const dispatch = useDispatch();

  // GET current user
  const [user, setUser] = useState<User>(null);
  const [friendList, setFriendList] = useState([]);
  const [disabled, setDisabled] = useState([]);

  const fetchAuthUser = async () => {
    try {
      const response = await axios.get(`/users/user`);
      if (response && response.data) {
        dispatch(setIsAuthenticated(true));
        dispatch(setAuthUser(response.data));
        setUser(response.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchAuthUser();
  }, []);

  // GET request get friendList from Friendship table in DB // set to state variable
  useEffect(() => {
    const controller = new AbortController();
    axios
      .get('/feed/friendlist')
      .then(({ data }) => {
        console.log('data from friends Axios GET ==>', data);
        data.map((user: any) => {
          if (user?.status === 'approved') {
            setFriendList([...friendList, user.accepter_id]);
          }
          if (user?.status === 'pending') {
            setDisabled([...disabled, user.accepter_id]);
          }
        });
      })
      .catch((err) => {
        console.error('Failed to get Friends:', err);
      });
    // aborts axios request when component unmounts
    return () => controller?.abort();
  }, []);

  // POST request friendship 'pending' status to db
  const requestFriendship = (friend: number) => {
    console.log('your friendship is requested', friend);
    axios
      .post('/friends', {
        // accepter_id is user on reel
        accepter_id: friend,
      })
      .then((data) => {
        // console.log('Friend request POSTED', data);
      })
      .catch((err) => {
        console.error('Friend request axios FAILED', err);
      });
  };

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
    <main className='reel-container'>
      {reels.map((reel) => {
        return (
          <div key={reel.id + 'reel'}>
            <ReelItem
              user={user}
              reel={reel}
              friendList={friendList}
              requestFriendship={requestFriendship}
              approveFriendship={approveFriendship}
            />
          </div>
        );
      })}
    </main>
  );
};

export default Reel;
