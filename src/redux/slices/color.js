import { createSlice } from "@reduxjs/toolkit";

export const colorSlice = createSlice({
    name: 'color',
    initialState: {
        stroke: '#000',
        fill: '#000'
    },
    reducers: {
        getStrokeColor: (state, action) =>{
            state.stroke = action.payload.value;
        },
        changeStrokeColor: (state, action) =>{
            state.stroke = action.payload.value;
        },
        getFillColor: (state, action) =>{
            state.fill = action.payload.value;
        },
        changeFillColor: (state, action) =>{
            state.fill = action.payload.value;
        }
    }
})

export const colorActions = colorSlice.actions;
export const selectStrokeColor = state => state.color.stroke;
export const selectFillColor = state => state.color.fill;

export default colorSlice.reducer;