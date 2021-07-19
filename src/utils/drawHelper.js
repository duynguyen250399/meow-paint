import { PaintAction } from "../constants";

export const fillCircle = (context, x, y, radius, color) => {
    context.fillStyle = color;
    context.beginPath();
    context.arc(x, y, radius, 0, 2 * Math.PI);
    context.fill();
}

export const drawRectangle = (context, x, y, w, h, options) => {

    const {
        fillColor,
        strokeColor,
        strokeWidth,
        lineCap,
        lineJoin,
        action
    } = options;

    context.beginPath();
    context.rect(x, y, w, h);

    if (action === PaintAction.RECT_STROKE) {
        context.strokeStyle = strokeColor;
        context.lineWidth = strokeWidth;
        context.lineCap = lineCap;
        context.lineJoin = lineJoin;
        context.stroke();
    }
    else if (action === PaintAction.RECT_FILL) {
        context.fillStyle = fillColor;
        context.fill();
    }

    context.closePath();

}
