import * as React from 'react';
import GoogleButton from 'react-google-button';
const SignUp = () => {

  // redirect user to sign up page
  const redirectToGoogleSSO = () => {
    window.location.href = `${process.env.HOST}:4000/auth/login/google`;
  };

  return (
    <div className="container">
      <div className="row justify-content-center mt-5">
        <div className="col-md-6">
          <div className="card shadow p-3 rounded-lg border-0">
            <div className="d-flex justify-content-center align-items-center mb-4">
              <h2 className="m-0 font-weight-bold">theSpot</h2>
            </div>
            <div className="d-flex justify-content-center mb-3">
              <GoogleButton onClick={redirectToGoogleSSO} />
            </div>
            <p className="text-center">Welcome</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
