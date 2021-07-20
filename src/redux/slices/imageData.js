import { createSlice } from "@reduxjs/toolkit";

export const imageDataSlice = createSlice({
    name: 'imageData',
    initialState: {
        imageDataArray: [],
        imageDataIndex: -1,
        clear: false,
        undo: false,
        redo: false,
        save: false
    },
    reducers: {
        clearImageData: (state) => {
            state.imageDataArray = [];
            state.imageDataIndex = -1;
            state.clear = true;
        },
        clearImageDataSuccess: (state) => {
            state.clear = false;
        },
        addImageData: (state, action) => {
            state.imageDataArray.push(action.payload.data);
            state.imageDataIndex += 1;
        },
        undo: (state, action) => {
            state.undo = true;
            state.imageDataIndex = action.payload.index;
        },
        undoSuccess: (state) => {
            state.undo = false;
        },
        redo: (state, action) => {
            state.redo = true;
            state.imageDataIndex = action.payload.index;
        },
        redoSuccess: (state) => {
            state.redo = false;
        },
        savePaint: (state) => {
            state.save = true;
        },
        savePaintSuccess: (state) => {
            state.save = false;
        }
    }
})

export const imageDataActions = imageDataSlice.actions;
export const selectImageDataArray = state => state.imageData.imageDataArray;
export const selectImageDataIndex = state => state.imageData.imageDataIndex;
export const selectClear = state => state.imageData.clear;
export const selectUndo = state => state.imageData.undo;
export const selectRedo = state => state.imageData.redo;
export const selectSave = state => state.imageData.save;

export default imageDataSlice.reducer;