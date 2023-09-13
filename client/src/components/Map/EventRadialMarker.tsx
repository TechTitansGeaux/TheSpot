import React from 'react';
import { Marker } from 'react-map-gl';

type Props = {
  zoom: number
  key: string
  latitude: number
  longitude: number
}

const EventRadialMarker: React.FC<Props>= ({zoom, latitude, longitude}) => {
  return (
    <Marker latitude={latitude} longitude={longitude} anchor='center' >
      <div style={{  height: `${(20 * ( 2 ** (zoom - 15)))}px`, width: `${(20 * ( 2 ** (zoom - 15)))}px` }} className='EventRadialMarker'>
      </div>
    </Marker>
  )
}

export default EventRadialMarker;
