interface initState {
    isAuthenticated: boolean;
    authUser: string | null;
}
export declare const setIsAuthenticated: import("@reduxjs/toolkit").ActionCreatorWithPayload<any, "app/setIsAuthenticated">, setAuthUser: import("@reduxjs/toolkit").ActionCreatorWithPayload<any, "app/setAuthUser">;
declare const _default: import("redux").Reducer<initState>;
export default _default;
