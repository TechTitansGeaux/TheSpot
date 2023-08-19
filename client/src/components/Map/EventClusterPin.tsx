import React from 'react';

type Props =  {
  amount: number
  key: string
  lat: number
  lng: number
}

const EventClusterPin: React.FC<Props> = (props) => {
  return (
    <div className="EventClusterPin">
      { props.amount }
    </div>
  )
}

export default EventClusterPin;
