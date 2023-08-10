import React from 'react';

type Props = {
  user: {
    id: number
    username: string
    displayName: string
    type: string
    geolocation: string
    mapIcon: null
    birthday: string
    privacy: null
    accessibility: null
    email: string
    picture: string
    googleId: string
    createdAt: string
    updatedAt: string
  }
  lat: number
  lng: number
};

const UserPin: React.FC<Props> = () => {
  // const [lat, setLat] = useState(0);
  // const [lng, setLng] = useState(0);

  // const setLocation = () => {
  //   const str = props.user.geolocation;
  //   const arr = str.split(',');
  //   setLat(+arr[0]);
  //   setLng(+arr[1]);
  // }

  // useEffect(() => {
  //   setLocation();
  // }, [])

  return (
    <div style={{ backgroundColor: 'black', width: '75px', border: '4px solid green' }} >
      {'bob'}
    </div>

  );
};



export default UserPin;