import * as React from 'react';
import Reel from './Reel';
import axios from 'axios';
import { useState, useEffect } from 'react';
import './feed.css';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';

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
  AddFriend?: React.ReactNode | React.ReactNode[];
};

const Feed: React.FC<Props> = ({user}) => {
  const [reels, setReels] = useState([]);
  const [filter, setFilter] = useState('recent'); // filter feed state
  const [geoF, setGeoF] = useState(15); //geo filter by miles
  const [friends, setFriends] = useState([]); // friend list for current user
  const [following, setFollowing] = useState([]); // following list for current user (personal)
  const [userLat, setUserLat] = useState(0);
  const [userLong, setUserLong] = useState(0);
  const [followers, setFollowers] = useState([]); // followers list for current user (business)
  const [userType, setUserType] = useState(''); // personal or business
    // filter dialog
  const [open, setOpen] = React.useState(false);
  const marks = [{value: 1, label: '1 mile'}, {value: 15, label: '15 miles'}, {value: 30, label: '30 miles'}];

  const findUserType = () => {
    if (user) {
      // console.log('user type:', user.type);
      if (user.type === 'business') {
        setUserType('business');
      } else if (user.type === 'personal') {
        setUserType('personal');
      }
    }
  };

  useEffect(() => {
    findUserType();
  }, [user]);

  const friendsReels: any = [];
  const followingReels: any = [];
  const followerReels: any = [];
  const geoReels: any = [];

  const geoFilterHandler = (event: Event, newValue: number | number[]) => {
    setGeoF(newValue as number);
  };

  const userCoord = (user: any) => {
    // console.log('user:', user?.geolocation);
    if (user) {
      // console.log('user:', user);
      const arr = user.geolocation.split(',');
      const lat = Number(arr[0]);
      const long = Number(arr[1]);
      setUserLat(lat);
      setUserLong(long);
    }
  };

  // find distance (miles) with 2 points
  const distance = (lat1: number, lat2: number, lon1: number, lon2: number) => {

    lon1 = lon1 * Math.PI / 180;
    lon2 = lon2 * Math.PI / 180;
    lat1 = lat1 * Math.PI / 180;
    lat2 = lat2 * Math.PI / 180;
    // Haversine formula
    const dlon = lon2 - lon1;
    const dlat = lat2 - lat1;
    const a = Math.pow(Math.sin(dlat / 2), 2)
              + Math.cos(lat1) * Math.cos(lat2)
              * Math.pow(Math.sin(dlon / 2),2);

    const c = 2 * Math.asin(Math.sqrt(a));

    const r = 3956;

    return(c * r);
  };

  // location filter to be used repeatedly arr is response.data
  const locFilter = (arr: any) => {
    for (let i = 0; i < arr.length; i++) {
      const geo = arr[i].User.geolocation.split(','); // User geo
      // console.log('user lat, user long:', userLat, userLong);
      // console.log('other user geo:', geo);
      const eventGeo = arr[i].Event.geolocation.split(',');
      // console.log('eventGeo:', eventGeo);
      const otherLat = Number(geo[0]);
      const otherLong = Number(geo[1]);
      const eventLat = Number(eventGeo[0]);
      const eventLong = Number(eventGeo[1]);
      const dist = distance(userLat, otherLat, userLong, otherLong);
      const eventDist = distance(userLat, eventLat, userLong, eventLong);
      // console.log('distance:', dist);
      // console.log('geoF:', geoF);
      if (dist <= geoF || eventDist <= geoF) {
        geoReels.push(arr[i]);
      }
    }
  };

  const getAllReelsRecent = () => {
    axios
      .get('/feed/recent')
      .then((response) => {
        locFilter(response.data);
        setReels(geoReels);
        setFilter('recent');
        setOpen(false);
      })
      .catch((err) => {
        console.error('Could not GET all recent reels:', err);
      })
  };

  const getAllReelsLikes = () => {
    axios
      .get('/feed/likes')
      .then((response) => {
        locFilter(response.data);
        setReels(geoReels);
        setFilter('likes');
        setOpen(false);
      })
      .catch((err) => {
        console.error('Could not GET all recent reels:', err);
      })
  };


  const getAllFriendReels = () => {
    axios
      .get('/feed/recent')
      .then((response) => {
        // console.log('reels recent res.data:', response.data);
        for (let i = 0; i < friends.length; i++) {
          for (let j = 0; j < response.data.length; j++) {
            if (friends[i].accepter_id === response.data[j].UserId) {
              friendsReels.push(response.data[j]);
            }
          }
        }
        locFilter(friendsReels);
        setReels(geoReels);
        setFilter('friends');
        setOpen(false);
      })
      .catch((err) => {
        console.error('Could not GET all frens reels:', err);
      })
  };

  const getFriendList = () => {
    if (user) {
      if (user.type === 'personal') {
        axios
          .get(`/feed/frens`)
          .then((response) => {
            //console.log('friends response.data:', response.data);
            setFriends(response.data);
          })
          .catch((err) => {
            console.error('Could not GET friends:', err);
          })
      }
    }
  };

  // for personal accounts
  const getFollowingList = () => {
    if (user) {
      if (user.type === 'personal') {
        axios
          .get('/feed/following')
          .then((response) => {
            // console.log('following:', response.data);
            setFollowing(response.data);
          })
          .catch((err) => {
            console.error('Could not GET followings:', err);
          })
      }
    }
  };

  const getAllFollowingReels = () => {
    axios
      .get('/feed/recent')
      .then((response) => {
        for (let i = 0; i < following.length; i++) {
          for (let j = 0; j < response.data.length; j++) {
            if (following[i].followedUser_id === response.data[j].UserId) {
              followingReels.push(response.data[j]);
            }
          }
        }
        locFilter(followingReels);
        setReels(geoReels);
        setFilter('following');
        setOpen(false);
      })
      .catch((err) => {
        console.error('Could not GET all following reels:', err);
      })
  };

  // business accounts
  const getFollowersList = () => {
    if (user) {
      if (user.type === 'business') {
        axios
          .get('/feed/followers')
          .then((response) => {
            console.log('followers:', response.data);
            setFollowers(response.data);
          })
          .catch((err) => {
            console.error('Could not GET followers', err);
          })
      }
    }
  };

  const getAllFollowersReels = () => {
    axios
    .get('/feed/recent')
    .then((response) => {
      for (let i = 0; i < followers.length; i++) {
        for (let j = 0; j < response.data.length; j++) {
          if (followers[i].follower_id === response.data[j].UserId) {
            followerReels.push(response.data[j]);
          }
        }
      }
      locFilter(followerReels);
      setReels(geoReels);
      setFilter('followers');
      setOpen(false);
    })
    .catch((err) => {
      console.error('Could not GET all following reels:', err);
    })
  };

  const getAllReels = () => {
    if (filter === 'recent') {
      getAllReelsRecent();
    } else if (filter === 'friends') {
      getAllFriendReels();
    } else if (filter === 'following') {
      getAllFollowingReels();
    } else if (filter === 'likes') {
      getAllReelsLikes();
    } else if (filter === 'followers') {
      getAllFollowersReels();
    }
  };

  // filter dialog
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };


  useEffect(() => {
    userCoord(user);
  }, [user, reels]);

  useEffect(() => {
    getAllReels();
  }, [filter, geoF, user, userLat]);

  useEffect(() => {
    if (user) {
      if (user.type === 'personal') {
        getFriendList();
      }
    }
  }, [user, filter]);

  useEffect(() => {
    if (user) {
      if (user.type === 'personal') {
        getFollowingList();
      }
    }
  }, [user, filter]);

  useEffect(() => {
    if (user) {
      if (user.type === 'business') {
        getFollowersList();
      }
    }
  }, [user, filter]);

  return (
    <>
    {userType === 'personal' && (
      <div className='filter-container'>
      <div className='label'>
        Filter By{' '}
      <button
        className='filter-btn'
        name='Filter Button'
        onClick={handleClickOpen}
      >
        {filter}
      </button>
    <Dialog
      open={open}
      onClose={handleClose}
    >
      <DialogTitle id='filter-dialog-title'>
        {'Filter By'}
      </DialogTitle>
      <DialogActions>
        <Button onClick={getAllReelsRecent} autoFocus>Recent</Button>
        <Button onClick={getAllFriendReels} autoFocus>Friends</Button>
        <Button onClick={getAllFollowingReels} autoFocus>Following</Button>
        <Button onClick={getAllReelsLikes} autoFocus>Likes</Button>
      </DialogActions>
    </Dialog>
      </div>
    </div>
    )}

    {userType === 'business' && (
      <div className='filter-container'>
      <div className='label'>
        Filter By
      <button
        className='filter-btn'
        name='Filter Button'
        onClick={handleClickOpen}
      >
        {filter}
      </button>
    <Dialog
      open={open}
      onClose={handleClose}
    >
      <DialogTitle id='filter-dialog-title'>
        {'Filter By'}
      </DialogTitle>
      <DialogActions>
        <Button onClick={getAllReelsRecent} autoFocus>Recent</Button>
        <Button onClick={getAllFollowersReels} autoFocus>Followers</Button>
        <Button onClick={getAllReelsLikes} autoFocus>Likes</Button>
      </DialogActions>
    </Dialog>
      </div>
    </div>
    )}
    <div className='slider'>
      <Box sx={{ width: 300 }}>
        <Slider
          defaultValue={geoF}
          min={1}
          max={30}
          onChange={geoFilterHandler}
          marks={marks}
          valueLabelDisplay="auto"
          color="secondary"
          classes={{ markLabel: 'white' }}
        />
      </Box>
    </div>
      <div className='container-full-w'>
        <Reel
          reels={reels}
          friends={friends}
          getAllReels={getAllReels}
        />
      </div>
    </>
  );
};

export default Feed;