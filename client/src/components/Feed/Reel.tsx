import * as React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setAuthUser, setIsAuthenticated } from '../../store/appSlice';
import { Suspense, lazy, memo } from 'react';
import Loading from './Loading'
const ReelItem = lazy(() => import('./ReelItem'));
// import ReelItem from './ReelItem';
import { useTheme } from '@mui/material/styles';
import { AnimatePresence, m, LazyMotion, domAnimation } from 'framer-motion';
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

const Reel: React.FC<Props> = memo(function Reel({ reels, getAllReels }) {
  const theme = useTheme();
  const dispatch = useDispatch();
  // to open friends alert
  const [openAlert, setOpenAlert] = useState(false);
  // to open follower alert
  const [followAlert, setFollowAlert] = useState(false);
  // GET current user
  const [user, setUser] = useState<User>(null);
  const [friendList, setFriendList] = useState([]);
  const [disabled, setDisabled] = useState([]);
  const [followed, setFollowed] = useState([]);
  const [likeTotal, setLikeTotal] = useState(0);
  const [likes, setLikes] = useState([]); // user's reels that have been liked
  // const [likesPersist, setLikesPersist] = useState([]);
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

  // POST request to follow a business user
  const requestFollow = (followedUser: number) => {
    console.log('request to followedUser_id=>', followedUser);
    handleAlertOpen('Now Following');

    axios
      .put('/followers', {
        followedUser_id: followedUser,
      })
      .then((data) => {
        setFollowed((prev) => [...prev, followedUser]);
        setDisabled([...disabled, followedUser]);
        // sockets for following notifications
        socket.emit('followersNotif', 'following');
        console.log('Now following followedUser_id: ', followedUser);
      })
      .catch((err) => {
        console.error('Follow request axios FAILED: ', err);
      });
  };

  // DELETE request to unfollow a business user
  const requestUnfollow = (followedUser: number) => {
    console.log('request to followedUser_id=>', followedUser);
    // update below to remove from array like friends
    axios
      .delete(`/followers/${followedUser}`, {
        data: { followedUser_id: followedUser },
      })
      .then((data) => {
        const foundFollower = followed.indexOf(followedUser);
        console.log('found follower ===>', foundFollower);
        setDisabled([...disabled, followedUser]);
        setFollowed((prev) => prev.splice(foundFollower, 1));
        console.log('Now unfollowing | delete followedUser_id: ', followedUser);
      })
      .catch((err) => {
        console.error('unfollow request axios FAILED: ', err);
      });
  };

  // POST request friendship 'pending' status to db
  const requestFriendship = (friend: number) => {
    console.log('your friendship is requested', friend);
    setDisabled([...disabled, friend]);
    handleAlertOpen('Friend Request Pending');
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
        requester_id: friend, // CHANGED from requester_id
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
        socket.emit('likesNotif', 'like');
        getAllReels();
      })
      .catch((err) => {
        console.error('Could not DELETE reel', err);
      });
  };

  // ADD ONE LIKE per Reel
  const handleAddLike = (reelId: number, idUser: number) => {
    // console.log('ADD like of reelId =>', reelId);
    axios
      .put(`/likes/addLike/${reelId}`)
      .then((data) => {
        // console.log('Likes Updated AXIOS', data);
        setLikes((prev) => [...prev, reelId]);
        setLikeTotal((prev) => prev + 1);
      })
      .catch((err) => console.error('Like AXIOS route Error', err));
  };

  // REMOVE ONE LIKE per Reel
  const handleRemoveLike = (reelId: number) => {
    // console.log('REMOVE like of reelId =>', reelId);
    axios
      .put(`/likes/removeLike/${reelId}`)
      .then((data) => {
        const foundLike = likes.indexOf(reelId);
        if (foundLike !== -1) {
          setLikes((prev) => prev.splice(foundLike, 1));
        }
        setLikes((prev) => prev.splice(foundLike, 1));
        if (likeTotal !== 0) {
          setLikeTotal((prev) => prev - 1);
        }
      })
      .catch((err) => console.error('Like AXIOS route Error', err));
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
          // for (let i = 0; i < response.data.length; i++) {
          //   if (user?.id === response.data[i].UserId) {
          //     setLikes((prev) => [...prev, response.data[i].ReelId]);
          //   }
          // }
        })
        .catch((err) => {
          console.error('Could not GET all likes:', err);
        });
    }
  };

  // useEffect(() => {
  //   getLikes();
  // }, []);

  useEffect(() => {
    getAllFollowed();
  }, []);

  // snackbar logic for pending friends
  //Snackbar for friends and follows
  const handleAlertOpen = (option: string) => {
    console.log('snackbar open for pending friend');
    if (option === 'Friend Request Pending') {
      setOpenAlert(true);
    } else {
      setFollowAlert(true);
    }
  };

  const handleAlertClose = (
    event: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenAlert(false);
  };

  console.log('reel from REEL ---------->', reels);
  return (
    <main
      className='reel-container'
      style={{ fontSize: theme.typography.fontSize }}
    >
      <AnimatePresence initial={false}>
        <Suspense fallback={<Loading />}>
          {reels.map((reel) => {
            return (
              <LazyMotion
                key={reel.id + 'reel' + Math.floor(Math.random() * 25)}
                features={domAnimation}
              >
                <m.div
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
                  <ReelItem
                    key={reel.id + 'reelItem' + Math.floor(Math.random() * 35)}
                    user={user}
                    reel={reel}
                    reels={reels}
                    friendList={friendList}
                    requestFriendship={requestFriendship}
                    requestUnfollow={requestUnfollow}
                    requestFollow={requestFollow}
                    followed={followed}
                    disabledNow={disabled}
                    deleteReel={deleteReel}
                    handleAddLike={handleAddLike}
                    handleRemoveLike={handleRemoveLike}
                    likeTotal={likeTotal}
                    likes={likes}
                    muted={muted}
                    handleToggleMute={handleToggleMute}
                    openAlert={openAlert}
                    handleAlertClose={handleAlertClose}
                  />
                </m.div>
              </LazyMotion>
            );
          })}
        </Suspense>
      </AnimatePresence>
    </main>
  );
});

export default Reel;
