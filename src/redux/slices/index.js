import colorReducer, { colorActions } from "./color";
import imageDataReducer, { imageDataActions } from "./imageData";

export default {
    color: colorReducer,
    imageData: imageDataReducer
}

export const actions = {
    ...colorActions,
    ...imageDataActions
}