import { createSlice } from "@reduxjs/toolkit";
import { PaintAction } from "../../constants";

export const appSlice = createSlice({
    name: 'app',
    initialState: {
        paintAction: PaintAction.PEN
    },
    reducers: {
        changePaintAction: (state, action) =>{
            state.paintAction = action.payload.paintAction;
        }
    }
})

export const appActions = appSlice.actions;
export const selectPaintAction = state => state.app.paintAction;

export default appSlice.reducer;