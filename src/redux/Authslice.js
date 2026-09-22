import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    accessToken: null,
    bootstrapped: false, // true once the initial silent-refresh attempt has resolved
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setAccessToken: (state, action) => {
            state.accessToken = action.payload;
            state.bootstrapped = true;
        },
        logout: (state) => {
            state.accessToken = null;
            state.bootstrapped = true;
        },
    }
})

export const { setAccessToken, logout } = authSlice.actions;
export default authSlice.reducer;