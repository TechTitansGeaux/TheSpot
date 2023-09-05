import * as React from 'react';
import CircularProgress from '@mui/material/CircularProgress';

const Loading = () => {
  return (
    <div className='loading-feed'>
      <CircularProgress size='8rem' color='secondary' />
    </div>
  );
}

export default Loading;