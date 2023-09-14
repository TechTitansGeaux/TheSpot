import React from 'react';
import EventIcon from '@mui/icons-material/Event';
import PersonSharpIcon from '@mui/icons-material/PersonSharp';
import BusinessSharpIcon from '@mui/icons-material/BusinessSharp';
import { Marker, useMap } from 'react-map-gl';

type Props =  {
  className: string
  latitude: number
  longitude: number
  expansionZoom: number
  amount: number
}

const iconSetter = (className: string) => {
  if (className === 'EventClusterPin') {
    return <EventIcon/>;
  } else if (className === 'UserClusterPin') {
    return <PersonSharpIcon/>;
  } else if (className === 'BusinessClusterPin') {
    return <BusinessSharpIcon/>;
  }
}

const ClusterPin: React.FC<Props> = (props) => {

  const { current } = useMap();

  const zoomTo = (lng: number, lat: number) => {
    current.flyTo({center: [+lng, +lat], zoom: props.expansionZoom });
  }

  return (
    <Marker latitude={+props.latitude} longitude={+props.longitude} anchor='center' >
      <div className={props.className} onClick={() => {
        zoomTo(props.longitude, props.latitude);
      }}>
        <div style={{ display: 'inline-block', transform: 'translateY(12.5px)' }}> {
          iconSetter(props.className)
        }</div>
        <div style={{ display: 'inline-block', transform: 'translateY(7.5px)' }}>
          { props.amount }
        </div>
      </div>
    </Marker>
  )
}

export default ClusterPin;
