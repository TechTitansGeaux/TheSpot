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
          <button className='button' style={{ width: '240px', height: 'auto' }} onClick={redirectToGoogleSSO}>
          <svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid" viewBox="0 0 256 262">
  <path fill="#4285F4" d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"></path>
  <path fill="#34A853" d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"></path>
  <path fill="#FBBC05" d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782"></path>
  <path fill="#EB4335" d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"></path>
</svg>
  Continue with Google
            </button>
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
