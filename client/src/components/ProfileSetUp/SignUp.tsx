import React, { useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/autoplay';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import './SignUp.css';

import { Container, Grid, Card, CardContent, Typography } from '@mui/material';
import GoogleButton from 'react-google-button';
import { createTheme, ThemeProvider } from '@mui/material/styles';
const logoGradient = require('/client/src/img/logo-gradient.jpg');

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
  const onAutoplayTimeLeft = (s, time, progress) => {
    progressCircle.current.style.setProperty('--progress', 1 - progress);
    progressContent.current.textContent = `${Math.ceil(time / 1000)}s`;
  };

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="sm">
        <Grid
          container
          spacing={3}
          direction="column"
          alignItems="center"
          justifyContent="top"
          style={{ minHeight: '100vh' }}
        >
          <Grid item>
            <img
              src={logoGradient}
              alt="app logo"
              style={{ width: '200px', height: 'auto' }}
            />
          </Grid>
          <Grid item>
            <GoogleButton onClick={redirectToGoogleSSO} />
          </Grid>
          <Grid item>
          <Typography variant="h1" fontSize={'32px'} gutterBottom>
                      Welcome to The Spot!
                    </Typography>
          </Grid>
        </Grid>
        <div className='body'>
    <Swiper
      spaceBetween={30}
      centeredSlides={true}
      autoplay={{
        delay: 3500,
        disableOnInteraction: false,
      }}
      pagination={{
        clickable: true,
      }}
      navigation={true}
      modules={[Autoplay, Pagination, Navigation]}
      onAutoplayTimeLeft={onAutoplayTimeLeft}
      className="mySwiper"
    >
      <SwiperSlide id="slide-1"><h1>Discover and Connect:</h1></SwiperSlide>
      <SwiperSlide id="slide-2"><h1>Personalized Reels:</h1></SwiperSlide>
      <SwiperSlide id="slide-3"><h1>Plan Your Night:</h1></SwiperSlide>
      <SwiperSlide id="slide-4"><h1>Businesses and Event Organizers:</h1></SwiperSlide>
      <div className="autoplay-progress" slot="container-end">
        <svg viewBox="0 0 48 48" ref={progressCircle}>
          <circle cx="24" cy="24" r="20"></circle>
        </svg>
        <span ref={progressContent}></span>
      </div>
    </Swiper>
  </div>
      </Container>
    </ThemeProvider>
  );
};

export default SignUp;






