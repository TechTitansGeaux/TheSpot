/* eslint-disable @typescript-eslint/no-explicit-any */
interface initState {
    isAuthenticated: boolean;
    authUser: {
        id: number;
        username: string;
        displayName: string;
        type: string | null;
        geolocation: string | null;
        mapIcon: string | null;
        birthday: Date | null;
        privacy: string | null;
        accessibility: string | null;
        email: string | null;
        picture: string | null;
        googleId: string | null;
      }
       | null;
}
export declare const setIsAuthenticated: import("@reduxjs/toolkit").ActionCreatorWithPayload<any, "app/setIsAuthenticated">, setAuthUser: import("@reduxjs/toolkit").ActionCreatorWithPayload<any, "app/setAuthUser">;
declare const _default: import("redux").Reducer<initState>;
export default _default;
