import * as React from 'react';
import GoogleButton from 'react-google-button';
const logoGradient = require('/client/src/img/logo-gradient.jpg');
const SignUp = () => {

  // redirect user to sign up page
  const redirectToGoogleSSO = () => {
    window.location.href = `${process.env.HOST}:4000/auth/login/google`;
  };

  return (
    <div className='flex-container'>
      <div className='row justify-content-center mt-5'>
        <div className='col-md-6'>
          <div className='card shadow p-3 rounded-lg border-0'>
            <div className='d-flex justify-content-center align-items-center mb-4'>
              <img id='nav-logo' src={logoGradient} alt='app logo' />
            </div>
            <div className='d-flex justify-content-center mb-3'>
              <GoogleButton onClick={redirectToGoogleSSO} />
            </div>
            <h1 className='text-center'>Welcome</h1>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
