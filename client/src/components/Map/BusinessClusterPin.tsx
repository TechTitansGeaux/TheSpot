import React from 'react';
import BusinessSharpIcon from '@mui/icons-material/BusinessSharp';

type Props = {
  amount: number
  key: string
  lat: number
  lng: number
};

const BusinessClusterPin: React.FC<Props> = (props) => {
  return (
    <div className='BusinessClusterPin'>
      <div style={{ display: 'inline-block', transform: 'translateY(12.5px)' }}>
        <BusinessSharpIcon/>
      </div>
      <div style={{ display: 'inline-block', transform: 'translateY(7.5px)' }}>
        { props.amount }
      </div>
    </div>
  )
}

export default BusinessClusterPin;
