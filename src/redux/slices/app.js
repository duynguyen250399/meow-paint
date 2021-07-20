import { createSlice } from "@reduxjs/toolkit";
import { PaintAction } from "../../constants";

export const appSlice = createSlice({
    name: 'app',
    initialState: {
        paintAction: PaintAction.PEN,
        disabledSaveButton: true
    },
    reducers: {
        changePaintAction: (state, action) =>{
            state.paintAction = action.payload.paintAction;
        },
        changeSaveButtonStatus: (state, action) =>{
            state.disabledSaveButton = action.payload.status;
        }
    }
})

export const appActions = appSlice.actions;
export const selectPaintAction = state => state.app.paintAction;
export const selectDisabledSaveButton = state => state.app.disabledSaveButton;

export default appSlice.reducer;