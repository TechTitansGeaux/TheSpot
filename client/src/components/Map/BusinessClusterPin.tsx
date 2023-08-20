import React from 'react';

type Props = {
  amount: number
  key: string
  lat: number
  lng: number
};

const BusinessClusterPin: React.FC<Props> = (props) => {
  return (
    <div className='BusinessClusterPin'>
      {props.amount}
    </div>
  )
}

export default BusinessClusterPin;
