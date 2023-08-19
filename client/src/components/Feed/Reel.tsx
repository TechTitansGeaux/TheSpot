import * as React from 'react';
import { useState, useEffect, useRef, createRef } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
// import { useLocation } from 'react-router-dom';
import { setAuthUser, setIsAuthenticated } from '../../store/appSlice';
import ReelItem from './ReelItem';
import { useTheme } from '@mui/material/styles';
import { AnimatePresence, motion } from 'framer-motion';

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
  geolocation: string;
  twenty_one: boolean;
  createdAt: string;
  updatedAt: string;
  PlaceId: 1;
};


const Reel: React.FC<Props> = ({ reels, getAllReels }) => {
  const theme = useTheme();
  const dispatch = useDispatch();

  // GET current user
  const [user, setUser] = useState<User>(null);
  const [friendList, setFriendList] = useState([]);
  const [disabled, setDisabled] = useState([]);
  const [likeTotal, setLikeTotal] = useState(0);
  // const [removeLike, setRemoveLike] = useState([]);
  const [likes, setLikes] = useState([]); // user's reels that have been liked

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
    setDisabled([...disabled, friend]);
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
        // console.log('Friend request approved PUT', data);
      })
      .catch((err) => {
        console.error('Friend PUT request axios FAILED:', err);
      });
  };

  // DELETE your own reel
  const deleteReel = (reelId: number) => {
    axios
      .delete(`/feed/delete/${reelId}`)
      .then((data) => {
        console.log('Reel deleted', data);
        getAllReels();
      })
      .catch((err) => {
        console.error('Could not DELETE reel', err);
      });
  };

  // ADD like
  const handleAddLike = (reelId: number) => {
    console.log('Add like of reelId =>', reelId);
    axios
      .put(`/likes/addLike/${reelId}`)
      .then((data) => {
        // console.log('Likes Updated AXIOS', data);
        setLikes((prev) => [...prev, reelId]);
        setLikeTotal((prev) => prev + 1);
      })
      .catch((err) => console.error('Like AXIOS route Error', err));
  };

  // Remove like
  const handleRemoveLike = (reelId: number) => {
    console.log('Remove like');
    axios
      .put(`/likes/removeLike/${reelId}`)
      .then((data) => {
        // console.log('Likes Updated AXIOS', data);
        const foundLike = likes.indexOf(reelId)
        // console.log('foundLike', foundLike)
        if (foundLike !== -1) {
          setLikes((prev) => prev.splice(foundLike, 1));
          // console.log('splice likes', likes.splice(foundLike, 1))
        }
        // setLikeTotal(likeTotal - 1);
      })
      .catch((err) => console.error('Like AXIOS route Error', err));
  };

  // get reels that have been liked
  const getLikes = () => {
    if (user) {
      axios
        .get('/feed/likesTable')
        .then((response) => {
          // console.log('likes:', response.data);
          for (let i = 0; i < response.data.length; i++) {
            if (user?.id === response.data[i].UserId) {
              setLikes((prev) => [...prev, response.data[i].ReelId]);
            }
          }
        })
        .catch((err) => {
          console.error('Could not GET all likes:', err);
        });
    }
  };

  useEffect(() => {
    getLikes();
  }, [user]);


  return (
    <main
      className='reel-container'
      style={{ fontSize: theme.typography.fontSize }}
    >
      <AnimatePresence initial={false}>
        {reels.map((reel) => {
          return (
            <motion.div
              key={reel.id + 'reel'}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{
                ease: 'anticipate',
                duration: 0.2,
                delay: 0.2,
              }}
            >
              <ReelItem
                user={user}
                reel={reel}
                friendList={friendList}
                requestFriendship={requestFriendship}
                disabledNow={disabled}
                deleteReel={deleteReel}
                handleAddLike={handleAddLike}
                handleRemoveLike={handleRemoveLike}
                likeTotal={likeTotal}
                likes={likes}
              />
            </motion.div>
          );
        })}
      </AnimatePresence>
    </main>
  );
};

export default Reel;