import React from 'react';
import EventIcon from '@mui/icons-material/Event';
import PersonSharpIcon from '@mui/icons-material/PersonSharp';
import BusinessSharpIcon from '@mui/icons-material/BusinessSharp';


type Props =  {
  amount: number
  key: string
  lat: number
  lng: number
  onClick: () => void
  className: string
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
  return (
    <div className={props.className} onClick={props.onClick}>
      <div style={{ display: 'inline-block', transform: 'translateY(12.5px)' }}> {
        iconSetter(props.className)
      }</div>
      <div style={{ display: 'inline-block', transform: 'translateY(7.5px)' }}>
        { props.amount }
      </div>
    </div>
  )
}

export default ClusterPin;
