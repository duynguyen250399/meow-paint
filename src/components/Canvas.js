import React, { useRef, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { PaintAction, Shape } from '../constants';
import { actions } from '../redux/slices';
import { selectClear, selectImageDataArray, selectImageDataIndex, selectRedo, selectSave, selectUndo } from '../redux/slices/imageData';
import { fillCircle } from '../utils/drawHelper';

function Canvas({
    strokeColor,
    cursorImage,
    cursorOffsetX,
    cursorOffsetY,
    fillColor,
    strokeWidth,
    lineCap,
    lineJoin,
    paintAction,
    width,
    height,
    bgColor = '#fff',
    style,
    className
}) {

    const canvasRef = useRef();
    const contextRef = useRef();
    const prevCoords = useRef({
        x: 0,
        y: 0
    });
    const dataRef = useRef();

    const [drawing, setDrawing] = useState(false);
    const [rects, setRects] = useState([]);

    const isClear = useSelector(selectClear);
    const isUndo = useSelector(selectUndo);
    const isRedo = useSelector(selectRedo);
    const isSave = useSelector(selectSave);
    const imageDataIndex = useSelector(selectImageDataIndex);
    const imageDataArray = useSelector(selectImageDataArray);


    const dispatch = useDispatch();

    var drawX = 0, drawY = 0;
    var rectWidth = 0, rectHeight = 0;

    const init = () => {
        const canvas = canvasRef.current;
        contextRef.current = canvas.getContext('2d');
        canvas.width = width;
        canvas.height = height;

        const initialImageData = contextRef.current.getImageData(0, 0, width, height);
        dispatch(actions.addImageData({ data: initialImageData }));

        fillBackground();

        window.addEventListener('keyup', (e) => {
            if (e.ctrlKey && e.key === 'z') {
                onPressUndo();
            }

            if (e.ctrlKey && e.key === 'y') {
                onPressRedo();
            }
        });
    }

    useEffect(() => {
        init();

        return () => {
            window.removeEventListener('keyup', (e) => {
                console.log('Keyup event has been discarded...');
            });
        }
    }, [])

    useEffect(() => {

        if (isClear) {
            clear();
        }

        if (isUndo) {
            undo();
        }

        if (isRedo) {
            redo();
        }

        if (isSave) {
            saveImageData();
        }

        dataRef.current = {
            index: imageDataIndex,
            length: imageDataArray.length
        }
    })

    const onPressUndo = () => {
        let index = dataRef.current.index > 0 ? dataRef.current.index - 1 : 0;
        dispatch(actions.undo({ index }));
    }

    const onPressRedo = () => {
        let index = dataRef.current.index < dataRef.current.length - 1 ? dataRef.current.index + 1 : dataRef.current.length - 1;
        dispatch(actions.redo({ index }));
    }

    const fillBackground = () => {
        const context = contextRef.current;
        context.fillStyle = bgColor;
        context.fillRect(0, 0, width, height);
    }

    const startDraw = ({ nativeEvent }) => {

        setDrawing(true);

        const context = contextRef.current;
        const { offsetX, offsetY } = nativeEvent;

        prevCoords.current = { x: offsetX, y: offsetY };

        context.beginPath();

        context.moveTo(offsetX, offsetY);
    }

    const drawState = (e) => {
        const context = contextRef.current;

        rects.forEach(rect => {
            context.beginPath();
            context.rect(rect.x, rect.y, rect.width, rect.height);
            if (!rect.fill) {
                context.strokeStyle = rect.color;
                context.lineWidth = strokeWidth;
                context.stroke();
            }
            else {
                context.fillStyle = rect.color;
                context.fill();
            }
            context.closePath();
        })
    }

    const draw = ({ nativeEvent }) => {

        if (drawing) {

            switch (paintAction) {
                case PaintAction.PEN:
                    penDraw(nativeEvent);
                    break;
                case PaintAction.RECT_STROKE:
                    drawShape(nativeEvent, Shape.RECTANGLE);
                    break;
                case PaintAction.RECT_FILL:
                    drawShape(nativeEvent, Shape.RECTANGLE);
                    break;
                default:
                    console.log('Invalid paint action!');
            }

        }
    }

    const stopDraw = ({ nativeEvent }) => {
        const context = contextRef.current;
        const { offsetX, offsetY } = nativeEvent;

        if (
            offsetX === prevCoords.current.x
            && offsetY === prevCoords.current.y
            && paintAction === PaintAction.PEN
        ) {
            fillCircle(context, offsetX, offsetY, strokeWidth / 2, strokeColor);
        }

        if (drawing) {
            setDrawing(false);
            context.closePath();
        }

        if (paintAction === PaintAction.RECT_STROKE) {
            setRects([...rects,
            {
                x: drawX,
                y: drawY,
                width: rectWidth,
                height: rectHeight,
                fill: false,
                color: strokeColor
            }
            ]);
        }
        else if (paintAction === PaintAction.RECT_FILL) {
            setRects([...rects,
            {
                x: drawX,
                y: drawY,
                width: rectWidth,
                height: rectHeight,
                fill: true,
                color: fillColor
            }
            ]);
        }

        const imageData = context.getImageData(0, 0, width, height);

        dispatch(actions.addImageData({ data: imageData }));
    }

    const penDraw = (e) => {
        const context = contextRef.current;
        const { offsetX, offsetY } = e;

        context.lineCap = lineCap;
        context.lineJoin = lineJoin;
        context.lineWidth = strokeWidth;
        context.strokeStyle = strokeColor;

        context.lineTo(offsetX, offsetY);
        context.stroke();

    }

    const drawShape = (e, shape) => {
        const context = contextRef.current;
        const { offsetX, offsetY } = e;

        context.lineCap = lineCap;
        context.lineJoin = lineJoin;
        context.lineWidth = strokeWidth;
        context.strokeStyle = strokeColor;

        context.clearRect(0, 0, width, height);

        drawState(e);

        context.beginPath();

        if (shape === Shape.RECTANGLE) {
            rectWidth = Math.abs(offsetX - prevCoords.current.x);
            rectHeight = Math.abs(offsetY - prevCoords.current.y);

            const diffX = offsetX - prevCoords.current.x;
            const diffY = offsetY - prevCoords.current.y;


            if (diffX > 0 && diffY > 0) {
                drawX = prevCoords.current.x;
                drawY = prevCoords.current.y;
            }
            else if (diffX > 0 && diffY < 0) {
                drawX = prevCoords.current.x;
                drawY = prevCoords.current.y - rectHeight;
            }
            else if (diffX < 0 && diffY > 0) {
                drawX = prevCoords.current.x - rectWidth;
                drawY = prevCoords.current.y;
            }
            else {
                drawX = offsetX;
                drawY = offsetY;
            }

            context.rect(drawX, drawY, rectWidth, rectHeight);

            if (paintAction === PaintAction.RECT_STROKE) {
                context.strokeStyle = strokeColor;
                context.lineWidth = strokeWidth;
                context.lineCap = lineCap;
                context.lineJoin = lineJoin;
                context.stroke();
            }
            else if (paintAction === PaintAction.RECT_FILL) {
                context.fillStyle = fillColor;
                context.fill();
            };
        }
    }

    const clear = () => {
        const context = contextRef.current;
        context.clearRect(0, 0, width, height);
        dispatch(actions.clearImageDataSuccess());

        const initialImageData = context.getImageData(0, 0, width, height);
        dispatch(actions.addImageData({ data: initialImageData }));

        setRects([]);
    }

    const undo = () => {
        const context = contextRef.current;
        context.putImageData(imageDataArray[imageDataIndex], 0, 0);
        dispatch(actions.undoSuccess());
    }

    const redo = () => {
        const context = contextRef.current;
        context.putImageData(imageDataArray[imageDataIndex], 0, 0);
        dispatch(actions.redoSuccess());
    }

    const saveImageData = () => {
        const canvas = canvasRef.current;
        const imageSource = canvas.toDataURL('image/png').replace("image/png", "image/octet-stream");
        const saveLink = document.getElementById('saveLink');

        saveLink.setAttribute('download', `meow-paint-${Date.now()}.png`);
        saveLink.setAttribute('href', imageSource);
        saveLink.click();

        dispatch(actions.savePaintSuccess());
    }

    return (
        <canvas
            ref={canvasRef}
            onMouseDown={startDraw}
            onMouseUp={stopDraw}
            onMouseMove={draw}
            style={{ ...style, cursor: `url(${cursorImage}) ${cursorOffsetX} ${cursorOffsetY}, auto` }}
            className={className}
        >
            <a id='saveLink'></a>
        </canvas>
    )
}

export default Canvas
