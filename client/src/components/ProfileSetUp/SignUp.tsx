import React from 'react';
import { Button, Container, Typography, Grid, Card, CardContent } from '@mui/material';
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

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="sm">
        <Grid
          container
          spacing={3}
          direction="column"
          alignItems="center"
          justifyContent="center"
          style={{ minHeight: '100vh' }}
        >
          <Grid item>
            <img src={logoGradient}
            alt="app logo"
            style={{ width: '200px', height: 'auto' }} />
          </Grid>
          <Grid item>
            <GoogleButton onClick={redirectToGoogleSSO} />
          </Grid>
          <Grid item>
            <Card elevation={3} style={{ backgroundColor: 'var(--yellow)', padding: '2rem', textAlign: 'center' }}>
              <CardContent>
                <Typography variant="h4" gutterBottom>
                  Welcome to The Spot!
                </Typography>
                <Typography variant="subtitle1" paragraph>
                  Discover and Connect: The Spot is your go-to app for discovering local hot spots, events, and activities happening around you. Connect with friends and explore exciting experiences together.
                </Typography>
                <Typography variant="subtitle1" paragraph>
                  Personalized Reels: Explore user-generated reels to see what's trending and where the action is. Get inspired by the latest happenings and create your own reels to share your experiences.
                </Typography>
                <Typography variant="subtitle1" paragraph>
                  Plan Your Night: Whether you're looking for a night out or planning an event, The Spot has you covered. Find the best places to go, create your itinerary, and invite friends to join the fun.
                </Typography>
                <Typography variant="subtitle1" paragraph>
                  Businesses and Event Organizers: The Spot isn't just for individuals; it's a powerful platform for businesses too. Whether you're a bar, music venue, festival organizer, or event planner, our app offers a unique opportunity to showcase your events to users actively seeking new experiences. By promoting your events on "The Spot," you can connect with a diverse audience eager to discover and attend engaging activities.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </ThemeProvider>
  );
};

export default SignUp;
