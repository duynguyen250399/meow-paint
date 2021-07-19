import colorReducer, { colorActions } from "./color";
import imageDataReducer, { imageDataActions } from "./imageData";
import appReducer, { appActions } from "./app";

export default {
    color: colorReducer,
    imageData: imageDataReducer,
    app: appReducer
}

export const actions = {
    ...colorActions,
    ...imageDataActions,
    ...appActions
}