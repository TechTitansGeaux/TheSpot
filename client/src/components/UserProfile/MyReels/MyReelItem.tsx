import React, {useRef, useEffect} from 'react'
import useIsInView from '../../Feed/useIsInView';

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
  myReels: {
    id: string;
    public_id: number;
    url: string;
    text?: string;
    like_count?: number;
    UserId: number;
    EventId?: number;
    User: User;
    Event: Event;
  };
};

const MyReelItem: React.FC<Props> = ({ myReels }) => {
  const myReelVideo = useRef<HTMLVideoElement>(null);
  const isInViewport = useIsInView(myReelVideo);

  if (isInViewport) {
    setTimeout(() => {
      myReelVideo.current.play();
    })
  };

useEffect(() => {
  if (!isInViewport) {
    setTimeout(() => {
      myReelVideo.current.pause();
    });

  }
}, [isInViewport]);

  return (
    <div className='myReelItem'>
      <p className='myReel-text'>{myReels?.text}</p>
      <video
        ref={myReelVideo}
        className='myReel-video'
        id={`video${myReels?.id}`}
        src={myReels?.url}
        loop={false}
        muted={true}
        preload='none'
        onClick={() => myReelVideo.current.play()}
      ></video>
    </div>
  );
}

export default MyReelItem;