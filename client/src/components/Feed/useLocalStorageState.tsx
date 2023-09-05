// import * as React from 'react';
// import { useState, useEffect } from 'react';

// const useLocalStorageState = (key: any, initialValue: any) => {
//   const defaultValue = localStorage.getItem(key);
//   const [state, setState] = useState(
//     defaultValue ? JSON.parse(defaultValue) : initialValue
//   );

//   useEffect(() => {
//     if (state !== undefined) localStorage.setItem(key, JSON.stringify(state));
//   }, [key, state]);

//   return [state, setState];
// };

// export default useLocalStorageState;