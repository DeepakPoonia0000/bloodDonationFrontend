import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    role:'',
}

export const dataSlicer = createSlice({
    name: 'userData',
    initialState,
    reducers: {
        userRole: (state, action) => {
            state.role = action.payload
        }
    }
})

export const { userRole } = dataSlicer.actions;

export default dataSlicer.reducer
