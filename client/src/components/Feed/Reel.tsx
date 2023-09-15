import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setAuthUser, setIsAuthenticated } from '../../store/appSlice';
import { FixedSizeList as List } from 'react-window';
import InfiniteLoader from 'react-window-infinite-loader';
import { Suspense, lazy } from 'react';
import Loading from './Loading'
const ReelItem = lazy(() => import('./ReelItem'));
// import ReelItem from './ReelItem';
import { useTheme } from '@mui/material/styles';
import { AnimatePresence, motion } from 'framer-motion';
import io from 'socket.io-client';
const socket = io();

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
  getAllReels: any;
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
  time: string;
  endTime: string;
  geolocation: string;
  address: string;
  twenty_one: boolean;
  public: boolean;
  createdAt: string;
  updatedAt: string;
  PlaceId: 1;
};

const Reel: React.FC<Props> = ({ reels, getAllReels }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const [user, setUser] = useState<User>(null);
  const [friendList, setFriendList] = useState([]);
  // const [disabled, setDisabled] = useState([]);
  const [followed, setFollowed] = useState([]);
  const [likes, setLikes] = useState([]); // user's reels that have been liked

  // state of audio on reels
  const [muted, setMuted] = useState(true);
  // toggle reel audio
  const handleToggleMute = () => setMuted((current) => !current);

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
        // console.log('data from friends Axios GET ==>', data);
        data.map((user: any) => {
          if (user?.status === 'approved') {
            setFriendList((prev) => [...prev, user.accepter_id]);
            console.log(
              'useEffect axios setFriendList | Reel.tsx line 120 | NO CALL ON LOAD'
            );
          }
        });
      })
      .catch((err) => {
        console.error('Failed to get Friends:', err);
      });
    // aborts axios request when component unmounts
    return () => controller?.abort();
  }, []);

  //GET request to retreive all followed users
  const getAllFollowed = () => {
    axios
      .get('/followers')
      .then(({ data }) => {
        data.map((row: any) => {
          if (!followed.includes(row.followedUser_id)) {
            setFollowed((prev) => [...prev, row.followedUser_id]);
          }
        });
        // console.log('All followed users retrieved AXIOS GET', data);
      })
      .catch((err) => {
        console.error('AXIO get all followed users FAILED', err);
      });
  };

  // DELETE your own reel
  const deleteReel = (reelId: number) => {
    axios
      .delete(`/feed/delete/${reelId}`)
      .then((data) => {
        console.log('Reel deleted', data);
        socket.emit('likesNotif', 'like');
        getAllReels();
      })
      .catch((err) => {
        console.error('Could not DELETE reel', err);
      });
  };

  // get reels that have been liked
  const getLikes = () => {
    if (user) {
      axios
        .get('/likes/likes')
        .then((response) => {
          for (let i = 0; i < response.data.length; i++) {
            for (let j = 0; j < reels.length; j++) {
              if (response.data[i].ReelId === reels[j].id) {
                likes.push(response.data[i]);
              }
            }
          }
          setLikes(likes);
        })
        .catch((err) => {
          console.error('Could not GET all likes:', err);
        });
    }
  };

  useEffect(() => {
    getLikes();
  }, []);

  useEffect(() => {
    getAllFollowed();
  }, []);

  return (
    <main
      className='reel-container'
      // style={{ fontSize: theme.typography.fontSize }}
    >
      <Suspense fallback={<Loading />}>
      <AnimatePresence initial={false}>
          {reels.map((reel) => {
            return (
                <motion.div
                  key={reel.id}
                  className='reel-child'
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{
                    ease: 'anticipate',
                    duration: 0.2,
                    delay: 0.2,
                  }}
                >
                  {/* // <List> */}
                  <ReelItem
                    key={reel.id + 'reelItem' + Math.floor(Math.random() * 35)}
                    user={user}
                    reel={reel}
                    reels={reels}
                    friendList={friendList}
                    deleteReel={deleteReel}
                    likes={likes}
                    muted={muted}
                    handleToggleMute={handleToggleMute}
                  />
                  {/* // </List> */}
                </motion.div>
            );
          })}
      </AnimatePresence>
      </Suspense>
    </main>
  );
};

export default React.memo(Reel);
