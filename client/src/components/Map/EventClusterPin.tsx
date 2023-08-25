import React from 'react';
import EventIcon from '@mui/icons-material/Event';


type Props =  {
  amount: number
  key: string
  lat: number
  lng: number
  onClick: () => void
}

const EventClusterPin: React.FC<Props> = (props) => {
  return (
    <div className="EventClusterPin" onClick={props.onClick}>
      <div style={{ display: 'inline-block', transform: 'translateY(12.5px)' }}>
        <EventIcon/>
      </div>
      <div style={{ display: 'inline-block', transform: 'translateY(7.5px)' }}>
        { props.amount }
      </div>
    </div>
  )
}

export default EventClusterPin;
