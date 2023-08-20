import React from 'react';


type Props = {
  amount: number
  key: string
  lat: number
  lng: number
};

const UserClusterPin: React.FC<Props> = (props) => {
  return (
    <div className='UserClusterPin'>
      {props.amount}
    </div>
  )
}

export default UserClusterPin;
