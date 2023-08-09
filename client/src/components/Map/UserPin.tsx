import React from 'react';
import PropTypes from 'prop-types';


const UserPin = (props: object) => {
  return (
    <div style={{ backgroundColor: 'black', width: '75px', border: '4px solid green' }}>
      {props.username}
    </div>

  );
};

UserPin.propTypes = {
  username: PropTypes.string
};

export default UserPin;