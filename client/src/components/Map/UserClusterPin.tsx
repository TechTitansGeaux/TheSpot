import React from 'react';
import PersonSharpIcon from '@mui/icons-material/PersonSharp';


type Props = {
  amount: number
  key: string
  lat: number
  lng: number
};

const UserClusterPin: React.FC<Props> = (props) => {
  return (
    <div className='UserClusterPin'>
      <div style={{ display: 'inline-block', transform: 'translateY(12.5px)' }}>
        <PersonSharpIcon/>
      </div>
      <div style={{ display: 'inline-block', transform: 'translateY(7.5px)' }}>
        { props.amount }
      </div>
    </div>
  )
}

export default UserClusterPin;
