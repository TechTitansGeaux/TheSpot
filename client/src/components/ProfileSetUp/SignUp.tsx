import React, { useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/autoplay';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import './SignUp.css';
import GoogleButton from 'react-google-button';
import { createTheme, ThemeProvider } from '@mui/material/styles';
const logoGradient = require('/client/src/img/logo-gradient.jpg');
const createReelImage = require('/client/src/components/ProfileSetUp/SignUpCont/CREATE_REEL.gif');
const mapsImage = require('/client/src/components/ProfileSetUp/SignUpCont/MAPS.gif');
const eventsImage = require('/client/src/components/ProfileSetUp/SignUpCont/EVENTS.gif');


const theme = createTheme({
  palette: {
    primary: {
      main: '#7161EF', // Customize the main color
    },
  },
});

const SignUp = () => {
  // Redirect user to sign up page
  const redirectToGoogleSSO = () => {
    window.location.href = `${process.env.HOST}/auth/login/google`;
  };

  const swiperRef = useRef(null);

  const progressCircle = useRef(null);
  const progressContent = useRef(null);
  const onAutoplayTimeLeft = (s: never, time: number, progress: number) => {
    progressCircle.current.style.setProperty('--progress', 1 - progress);
    progressContent.current.textContent = `${Math.ceil(time / 1000)}s`;
  };

  return (
    <ThemeProvider theme={theme}>
      <div className='container-sign-up'>
        <div className='flex-col'>
          <img
            src={logoGradient}
            alt='app logo'
            style={{ width: '240px', height: 'auto' }}
          />
        </div>
        <div className='flex-col'>
          <GoogleButton className='google-btn' style={{ width: '240px', height: 'auto' }} onClick={redirectToGoogleSSO} />
        </div>
        <div className='swiper-parent'>
          <Swiper
            spaceBetween={30}
            centeredSlides={true}
            autoplay={{
              delay: 4250,
              disableOnInteraction: false,
            }}
            pagination={{
              clickable: true,
            }}
            navigation={true}
            modules={[Autoplay, Pagination, Navigation]}
            onAutoplayTimeLeft={onAutoplayTimeLeft}
            className='mySwiper'
          >
            <SwiperSlide id='slide-1'>
              <h1>
                <span className='welcome'>WELCOME TO THE SPOT</span>
                Discover Local Events.
                <span className='white'>Connect with Friends.</span>
              </h1>
            </SwiperSlide>
            <SwiperSlide id='slide-2'>
              <h1>
                CREATE & POST
                <span className='yellow'>VIDEO REELS</span>
              </h1>
            </SwiperSlide>
            <SwiperSlide className='slide-phone'>
              <div
                className='phone-screen'
              >
                <img
                  // loading='lazy'
                  src={createReelImage}
                  alt='Create Reels'
                  className='phone-image'
                />
              </div>
            </SwiperSlide>
            <SwiperSlide id='slide-3'>
              <h1>
                <span className='yellow'>MAP OUT</span>
                YOUR EVENING
              </h1>
            </SwiperSlide>
            <SwiperSlide className='slide-phone'>
              <div
                className='phone-screen'
              >
                <img
                  // loading='lazy'
                  src={mapsImage}
                  alt='MAPS'
                  className='phone-image'
                />
              </div>
            </SwiperSlide>
            <SwiperSlide id='slide-4'>
              <h1>
                PROMOTE
                <span className='yellow'>LOCAL EVENTS</span>
              </h1>
            </SwiperSlide>
            <SwiperSlide className='slide-phone'>
              <div
                className='phone-screen'
              >
                <img
                  // loading='lazy'
                  src={eventsImage}
                  alt='EVENTS'
                  className='phone-image'
                />
              </div>
            </SwiperSlide>
            <div className='autoplay-progress' slot='container-end'>
              <svg viewBox='0 0 48 48' ref={progressCircle}>
                <circle cx='24' cy='24' r='20'></circle>
              </svg>
              <span ref={progressContent}></span>
            </div>
          </Swiper>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default SignUp;
