import React from 'react';

type Props = {
  zoom: number
  key: string
  lat: number
  lng: number
}

const EventRadialMarker: React.FC<Props>= ({zoom}) => {
  return (
    <div style={{  height: `${(40 * ( 2 ** (zoom - 15)))}px`, width: `${(40 * ( 2 ** (zoom - 15)))}px` }} className='EventRadialMarker'>
    </div>
  )
}

export default EventRadialMarker;
