import { configureStore } from "@reduxjs/toolkit";
import rootReducer, { actions } from "../slices";

export default configureStore({
    reducer: {
        ...rootReducer
    },
    middleware: (getDefaultMiddleware) =>{
        return getDefaultMiddleware({
            serializableCheck: {
                ignoredPaths: [
                    'imageData.imageDataArray'
                ],
                ignoredActionPaths: [
                    'payload.data'
                ]
            }
        })
    }
})