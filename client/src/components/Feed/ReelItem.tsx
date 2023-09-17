import React from 'react';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import Zoom from '@mui/material/Zoom';
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import InfoIcon from '@mui/icons-material/Info';
import { createTheme } from '@mui/material/styles';
import { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import Likes from '../UserProfile/Likes/Likes';
import Unlikes from '../UserProfile/Likes/Unlikes';
import './feed.css';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import { Link } from 'react-router-dom';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';
import Rsvp from '../UserProfile/Rsvps/Rsvp';
import UnRsvp from '../UserProfile/Rsvps/UnRsvp';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import useIsInView from './useIsInView';
import io from 'socket.io-client';
const socket = io();

dayjs.extend(relativeTime);
dayjs.extend(localizedFormat);

dayjs().format('L LT');

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

type Props = {
  reel: any;
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
  friendList?: any;
  user: User;
  deleteReel: any;
  muted: boolean;
  handleToggleMute: () => void;
  index: any;
  lastReelIndex: number;
  getAllReelsRecent: any;
  filter: string;
  handleAlertOpen: any;
};

const theme = createTheme({
  palette: {
    primary: {
      main: '#f0f465',
      dark: '#f433ab',
      contrastText: '#0b0113',
    },
    secondary: {
      main: '#f433ab',
      dark: '#f0f465',
      contrastText: '#0b0113',
    },
  },
});

// interface Type for createTheme
declare module '@mui/material/Snackbar' {
  interface SnackbarProps {
    variant: 'theSpot-pink';
  }
}

const ReelItem: React.FC<Props> = ({
  reel,
  reels,
  friendList,
  user,
  deleteReel,
  muted,
  handleToggleMute,
  index,
  lastReelIndex,
  getAllReelsRecent,
  filter,
  handleAlertOpen,
}) => {
  // REFERENCE VIDEO HTML element in JSX element // Uses a ref to hold an array of generated refs, and assign them when mapping.
  // ref for entire reelItem
  const reelItemRef = useRef(null);
  // ref for entire a video
  const videoRef = useRef<HTMLVideoElement>(null);
  // load new reels from last index
  const [loadNewReelsAt, setLoadNewReelsAt] = useState(lastReelIndex);
  const isInViewport = useIsInView(reelItemRef);

  const [loop, setLoop] = useState(false);
  const [stayDisabled, setStayDisabled] = useState([]);
  const [likesArr, setLikesArr] = useState([]); // user's own reels that have been liked FROM likes table
  const [likeTotal, setLikeTotal] = useState(0);
  const [likes, setLikes] = useState([]); // user's reels that have been liked
  const [followed, setFollowed] = useState([]); // followers state

  // Alert Dialog 'are you sure you want to delete this reel?'
  const [open, setOpen] = useState(false);
  // state of whether event is already over
  const [pastEvent, setPastEvent] = useState('');
  // event info to display on info icon hover: name, date, time
  const eventName = reel.Event.name;
  const eventDate = dayjs(reel.Event.date + reel.Event.time).format(
    'ddd, MMM D, h:mm A'
  );
  // all rsvps array
  const [rsvps, setRsvps] = useState([]);
  const [rsvpTotal, setRsvpTotal] = useState(0);
  const [disableRsvp, setDisableRsvp] = useState([]);
  const [openInfo, setOpenInfo] = useState(false);
  const [disabled, setDisabled] = useState([]);
  // to open friends alert

  const toggleEventTimeButton = useCallback(() => {
    checkEventTime();
  }, []);

  const handleInfoClick = () => {
    if (openInfo) {
      setOpenInfo(false);
    } else {
      toggleEventTimeButton();
      setOpenInfo(true);
    }
  };

  const closeInfo = () => {
    setOpenInfo(false);
  };

  // check if event is over
  const checkEventTime = () => {
    // declare raw event time
    const rawEventTime = reel.Event.date + 'T' + reel.Event.endTime;
    const formattedEventTime = new Date(rawEventTime);
    const timeForComparing = Date.parse(formattedEventTime.toString());

    const nowRaw = new Date();
    const now = Date.parse(nowRaw.toString());

    if (timeForComparing < now) {
      // console.log('event end time has passed')
      setPastEvent('(Event is over!)');
    }
    // }
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const getLikes = () => {
    const likes: any = []; // user's reels that have been liked

    if (user) {
      axios
        .get('/likes/likes')
        .then((response) => {
          //console.log('likes:', response.data);
          for (let i = 0; i < response.data.length; i++) {
            for (let j = 0; j < reels.length; j++) {
              if (response.data[i].ReelId === reels[j].id) {
                likes.push(
                  response.data[i].ReelId + `${response.data[i].UserId}`
                );
              }
            }
          }
          setLikesArr(likes);
          //  console.log('likes array:', likesArr);
        })
        .catch((err) => {
          console.error('Could not GET all likes:', err);
        });
    }
  };

  // GET all the rsvps
  const getRSVPs = () => {
    axios
      .get('/RSVPs/all')
      .then(({ data }) => {
        // console.log('Axios get request for all RSVPs', data);
        setRsvps(data);
        data.map((rsvp: any) => {
          if (rsvp.UserId === user?.id) {
            setDisableRsvp((prev) => [
              ...prev,
              rsvp.EventId + `${rsvp.UserId}`,
            ]);
          }
        });
      })
      .catch((err) => {
        console.error('Error could not GET all RSVPs', err);
      });
  };

  // RSVP functionality

  const toggleRsvpButton = useCallback(() => {
    getRSVPs();
  }, []);

  // POST / add new rsvps
  const addRsvps = (EventId: number) => {
    toggleRsvpButton();
    axios
      .put(`/RSVPs/addRsvp/${EventId}`)
      .then((data) => {
        console.log('RSVP added and Updated via AXIOS', data);
        setRsvpTotal((prev) => prev + 1);
        // setDisableRsvp((prev) => [...prev, [EventId, user?.id]]);
      })
      .catch((err) => console.error('Like AXIOS route Error', err));
  };

  // Delete / remove an rsvp
  const removeRsvps = (EventId: number) => {
    toggleRsvpButton();
    axios
      .delete(`/RSVPs/delete/${EventId}`)
      .then((data) => {
        console.log('RSVP added and Updated via AXIOS', data);
        setRsvpTotal((prev) => prev - 1);
      })
      .catch((err) => console.error('Like AXIOS route Error', err));
  };

  // GET request get friendList from Friendship table in DB // set to state variable
  useEffect(() => {
    axios
      .get('/feed/friendlist/pending')
      .then(({ data }) => {
        // console.log('data from friends to DISABLE button Axios GET ==>', data);
        data.map((user: any) => {
          if (user?.status === 'pending') {
            setStayDisabled((prev) => [...prev, user.accepter_id]);
          }
        });
      })
      .catch((err) => {
        console.error('Failed to get Disabled List:', err);
      });
  }, []);

  // likes functionality
  const toggleLikeButton = useCallback(() => {
    getLikes();
  }, []);

  // ADD ONE LIKE per Reel
  const handleAddLike = (reelId: number, idUser: number) => {
    toggleLikeButton();
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

  // Friends Functionality
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

  // Follows Functionality
  // POST request to follow a business user
  const requestFollow = (followedUser: number, followedUserName: string) => {
    console.log('request to followedUser_id=>', followedUser);
    handleAlertOpen(`Now Following ${followedUserName}`);

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

  // call getAllReels with length onload for reels
  const getAllReels = (length: number) => {
    if (filter === 'recent') {
      getAllReelsRecent(length, false);
    }
  };

  // observe videos with IntersectionObserver API to playback on scroll in view
  // if videoRef in viewport play in half a second
  if (isInViewport) {
    videoRef.current.play();
    setTimeout(() => {
      setLoop(true);
    });

    if (loadNewReelsAt === Number(reelItemRef.current.id)) {
      // increase loadNewReels by 2
      setLoadNewReelsAt((prev) => prev + 2);
      getAllReels(3);
    }
  }

  useEffect(() => {
    if (!isInViewport) {
      setTimeout(() => {
        videoRef.current.pause();
      });
      setLoop(false);
    }
  }, [isInViewport]);


  useEffect(() => {
    toggleLikeButton();
    toggleRsvpButton();
    toggleEventTimeButton();
  }, []);

  return (
    <div style={{ position: 'relative', zIndex: 0 }}>
      {true && (
        <div
          ref={reelItemRef}
          id={index}
          className='reel-child'
        >
          <>
            <div
              className={
                reel?.User.type === 'personal'
                  ? 'video-container'
                  : 'video-container video-business-container'
              }
            >
              {reel.url.length > 15 && (
                <video
                  className='reel'
                  ref={videoRef}
                  id={`video${reel.id}`}
                  src={reel.url}
                  poster={reel.url}
                  loop={loop}
                  muted={muted}
                  preload='none'
                  onClick={handleToggleMute}
                ></video>
              )}
              <h5 className='video-timestamp'>
                ... {dayjs(`${reel.createdAt}`).fromNow()}
              </h5>
              <p className='video-text'>{reel.text}</p>
              <>
                <ClickAwayListener onClickAway={closeInfo}>
                  <Tooltip
                    onClose={handleInfoClick}
                    open={openInfo}
                    disableFocusListener
                    disableHoverListener
                    disableTouchListener
                    title={
                      <div>
                        {eventName}
                        <br />
                        {eventDate}
                        <br />
                        {pastEvent}
                      </div>
                    }
                    placement='left'
                    PopperProps={{
                      sx: {
                        '& .MuiTooltip-tooltip': {
                          backgroundColor: 'transparent',
                          border: 'solid #F5FCFA 1px',
                          color: '#F5FCFA',
                        },
                      },
                    }}
                  >
                    <InfoIcon
                      onClick={handleInfoClick}
                      aria-label={eventName + eventDate}
                      className='info-icon'
                    />
                  </Tooltip>
                </ClickAwayListener>
                {/**Removes addFriend button if already approved friend*/}
                {user?.type === 'business' ||
                  (!friendList.includes(reel.User.id) &&
                    reel.User.id !== user?.id && (
                      <div className='friend-request'>
                        <Box
                          sx={{ position: 'relative', zIndex: '3' }}
                          className='friend-box'
                        >
                          <Fab
                            style={{ transform: 'scale(0.6)', zIndex: '3' }}
                            size='small'
                            color='primary'
                            aria-label='add'
                            className='friend-add-btn'
                            disabled={
                              disabled.includes(reel.User.id) ||
                              stayDisabled.includes(reel.User.id)
                            }
                          >
                            {reel?.User.type === 'personal' && (
                              <Tooltip
                                title='Add Friend'
                                TransitionComponent={Zoom}
                                placement='left'
                                PopperProps={{
                                  sx: {
                                    '& .MuiTooltip-tooltip': {
                                      backgroundColor: 'transparent',
                                      border: 'solid #F5FCFA 1px',
                                      color: '#F5FCFA',
                                    },
                                  },
                                }}
                              >
                                <AddIcon
                                  aria-label='Add Friend Button'
                                  sx={{ width: 25, height: 25 }}
                                  onClick={() => {
                                    requestFriendship(reel.User.id);
                                  }}
                                />
                              </Tooltip>
                            )}
                            {/**Replaces addFriend button with Follow button reel.User.type is a business*/}
                            {reel?.User.type === 'business' &&
                            reel.User.id !== user?.id ? (
                              <Tooltip
                                title={`Follow ${reel?.User.displayName}`}
                                TransitionComponent={Zoom}
                                placement='left'
                                PopperProps={{
                                  sx: {
                                    '& .MuiTooltip-tooltip': {
                                      backgroundColor: 'transparent',
                                      border: 'solid #F5FCFA 1px',
                                      color: '#F5FCFA',
                                    },
                                  },
                                }}
                              >
                                <AddIcon
                                  aria-label={`Follow ${reel?.User.displayName}`}
                                  sx={{ width: 25, height: 25 }}
                                  onClick={() =>
                                    requestFollow(
                                      reel.User.id,
                                      reel?.User.displayName
                                    )
                                  }
                                />
                              </Tooltip>
                            ) : (
                              reel?.User.type === 'business' &&
                              followed.includes(reel.User.id) && (
                                <Tooltip
                                  title={`Unfollow ${reel?.User.displayName}`}
                                  TransitionComponent={Zoom}
                                  placement='left'
                                  PopperProps={{
                                    sx: {
                                      '& .MuiTooltip-tooltip': {
                                        backgroundColor: 'transparent',
                                        border: 'solid #F5FCFA 1px',
                                        color: '#F5FCFA',
                                      },
                                    },
                                  }}
                                >
                                  <ClearOutlinedIcon
                                    aria-label={`Unfollow ${reel?.User.displayName}`}
                                    sx={{ width: 25, height: 25 }}
                                    onClick={() =>
                                      requestUnfollow(reel.User.id)
                                    }
                                  />
                                </Tooltip>
                              )
                            )}
                          </Fab>
                        </Box>
                      </div>
                    ))}
                {reel.UserId === user?.id && (
                  <div className='friend-request'>
                    <div>
                      <Tooltip
                        title='Delete Reel'
                        TransitionComponent={Zoom}
                        placement='right'
                        PopperProps={{
                          sx: {
                            '& .MuiTooltip-tooltip': {
                              backgroundColor: 'transparent',
                              border: 'solid #F5FCFA 1px',
                              color: '#F5FCFA',
                            },
                          },
                        }}
                      >
                        <button
                          className='delete-btn'
                          name='Delete Button'
                          aria-label='Delete Button'
                          onClick={handleOpen}
                        >
                          🗑️
                        </button>
                      </Tooltip>
                      <Dialog
                        open={open}
                        onClose={handleClose}
                        aria-labelledby='alert-dialog-title'
                        aria-describedby='alert-dialog-description'
                      >
                        <DialogTitle id='alert-dialog-title'>
                          {'Delete this reel?'}
                        </DialogTitle>
                        <DialogContent>
                          <DialogContentText id='alert-dialog-description'>
                            Are you sure you want to delete this reel?
                          </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                          <Button onClick={handleClose}>No</Button>
                          <Button onClick={() => deleteReel(reel.id)} autoFocus>
                            Yes
                          </Button>
                        </DialogActions>
                      </Dialog>
                    </div>
                  </div>
                )}
              </>
              <div className='friend-request' style={{ zIndex: '0' }}>
                <Tooltip
                  title={reel.User.displayName}
                  TransitionComponent={Zoom}
                  placement='left'
                  PopperProps={{
                    sx: {
                      '& .MuiTooltip-tooltip': {
                        backgroundColor: 'transparent',
                        border: 'solid #F5FCFA 1px',
                        color: '#F5FCFA',
                      },
                    },
                  }}
                >
                  <Avatar
                    className='friend-avatar'
                    aria-label={`Profile Avatar of ${reel.User.displayName}`}
                    sx={{
                      transform: 'scale(0.9)',
                      width: 48,
                      height: 48,
                      zIndex: '0',
                    }}
                    alt={reel.User.displayName}
                    src={reel.User.picture}
                  />
                </Tooltip>
              </div>
            </div>
            <div className='video-links-container'>
              <Box sx={{ width: '100%' }}>
                <BottomNavigation>
                  <BottomNavigationAction
                    className='bottom-nav-parent'
                    label='Likes'
                    showLabel={false}
                    component={'div'}
                    icon={
                      <div className='count-container'>
                        {!likesArr.includes(reel.id + `${user?.id}`) ? (
                          <Likes
                            handleAddLike={handleAddLike}
                            handleRemoveLike={handleRemoveLike}
                            reel={reel}
                            user={user}
                            likesBool={likesArr}
                          />
                        ) : (
                          <Unlikes
                            handleAddLike={handleAddLike}
                            handleRemoveLike={handleRemoveLike}
                            reel={reel}
                            user={user}
                            likesBool={likesArr}
                          />
                        )}
                        {reel.like_count >= 0 ? (
                          <p className='like-counter'>
                            {reel.like_count + likeTotal}
                          </p>
                        ) : (
                          <p className='like-counter'>
                            {reel.like_count < 0 ? 0 : reel.like_count}
                          </p>
                        )}
                      </div>
                    }
                  />
                  <BottomNavigationAction
                    label='Event Location'
                    component={'div'}
                    icon={
                      <Tooltip
                        title='See Event Location'
                        TransitionComponent={Zoom}
                        placement='top'
                        PopperProps={{
                          sx: {
                            '& .MuiTooltip-tooltip': {
                              backgroundColor: '#0b0113',
                              border: 'solid #F5FCFA 1px',
                              color: '#F5FCFA',
                            },
                          },
                        }}
                      >
                        <IconButton
                          sx={{
                            minHeight: '1rem',
                            minWidth: '1rem',
                          }}
                          component={Link}
                          to={'/Map'}
                          state={{
                            reelEvent: reel.Event.geolocation,
                            loggedIn: user,
                          }}
                        >
                          <LocationOnIcon
                            name='Event Location Button'
                            aria-label='Event Location Button'
                            color='primary'
                          />
                        </IconButton>
                      </Tooltip>
                    }
                    showLabel={false}
                  />
                  <BottomNavigationAction
                    className='bottom-nav-parent'
                    sx={{ position: 'relative', zIndex: '0' }}
                    component={'div'}
                    label='Going'
                    icon={
                      <React.Fragment>
                        <div className='count-container'>
                          {disableRsvp.includes(
                            reel?.Event.id + `${user?.id}`
                          ) ? (
                            <UnRsvp reel={reel} removeRsvps={removeRsvps} />
                          ) : (
                            <Rsvp reel={reel} addRsvps={addRsvps} />
                          )}
                          {reel.Event.rsvp_count !== 0 && (
                            <p className='rsvp-counter'>
                              {reel.Event.rsvp_count + rsvpTotal}
                            </p>
                          )}
                        </div>
                      </React.Fragment>
                    }
                    showLabel={false}
                  />
                </BottomNavigation>
              </Box>
            </div>
          </>
        </div>
      )}
    </div>
  );
};

export default ReelItem;
