import React from 'react';


type Props = {
  event: {
    id: number,
    name: string,
    rsvp_count: number,
    geolocation: string,
    twenty_one: boolean,
    PlaceId: number,
  }
  lat: number
  lng: number
}


const Event: React.FC<Props> = ({ event }) => {
  const togglePopUp = () => {
    const box = document.getElementById('popUp' + event.name + event.id)
    if (box.style.display === 'block') {
      box.style.display = 'none';
    } else {
      box.style.display = 'block';
    }
  }



  return (
    <div>
      <div className='eventDot' id={event.name + event.id} onClick={togglePopUp}>
        <div style={{ marginTop: '12.5px', fontSize: '20px', color: 'black' }}>
          {event.rsvp_count}
        </div>
      </div>
      <div className='eventPopUp' id={'popUp' + event.name + event.id} >
        <div style={{ textAlign: 'center', fontSize:'20px' }}>
          {event.name}
        </div>
        <div style={{ textAlign: 'center', fontSize:'20px' }}>
          {/* <p>
            {`Member Since: ${dayjs(props.user.createdAt).format('ll')}`}
          </p> */}
        </div>
      </div>
    </div>
  )
}

export default Event;
