import React, { useRef, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { PaintAction, Shape } from '../constants';
import { Line } from '../models/line';
import { Pencil } from '../models/pencil';
import { Rectangle } from '../models/shape';
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

    const pencil = new Pencil(strokeColor, strokeWidth);

    const canvasRef = useRef();
    const contextRef = useRef();
    const prevCoords = useRef({
        x: 0,
        y: 0
    });
    const dataRef = useRef();
    const cacheDrawDataRef = useRef([]);
    const drawDataRef = useRef([]);
    const drawDataIndexRef = useRef();

    const drawDataBufferRef = useRef([]);
    const startDrawPositionRef = useRef({
        x: 0,
        y: 0
    })

    const [drawing, setDrawing] = useState(false);

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
        undo();
    }

    const onPressRedo = () => {
        redo();
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
        startDrawPositionRef.current = { x: offsetX, y: offsetY };
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
            const data = {
                type: "line",
                x1: startDrawPositionRef.current.x,
                y1: startDrawPositionRef.current.y,
                x2: offsetX,
                y2: offsetY,
                strokeColor: strokeColor,
                strokeWidth: strokeWidth
            }

            drawDataBufferRef.current.push(data);
        }

        if (drawing) {
            setDrawing(false);
            context.closePath();
        }

        if (paintAction === PaintAction.RECT_STROKE || paintAction === PaintAction.RECT_FILL) {
            drawDataBufferRef.current.push({
                type: 'rectangle',
                x: drawX,
                y: drawY,
                width: rectWidth,
                height: rectHeight,
                outlined: paintAction === PaintAction.RECT_STROKE,
                fillColor: fillColor,
                strokeColor: strokeColor,
                strokeWidth: strokeWidth
            });
        }

        updateDrawData();

    }

    const updateDrawData = () => {
        if (drawDataRef.current.length > 0) {
            const lastIndex = drawDataRef.current.length - 1;
            drawDataRef.current.push([...drawDataRef.current[lastIndex], ...drawDataBufferRef.current]);
        }
        else {
            drawDataRef.current.push(drawDataBufferRef.current);
        }

        drawDataBufferRef.current = [];
    }

    const drawUpdate = () => {

        const context = contextRef.current;

        if (drawDataRef.current.length > 0) {
            const lastIndex = drawDataRef.current.length - 1;

            context.clearRect(0, 0, width, height);

            if (drawDataRef.current[lastIndex]) {
                drawDataRef.current[lastIndex].forEach(data => {
                    if (data.type === 'line') {
                        context.beginPath();
                        const { x1, y1, x2, y2 } = data;
                        pencil.drawLine(context, new Line(x1, y1, x2, y2));
                        context.closePath();
                    }

                    if (data.type === 'rectangle') {
                        const { x, y, width, height, strokeColor, fillColor, outlined } = data;
                        const color = outlined ? strokeColor : fillColor;
                        context.beginPath();
                        const rect = new Rectangle(x, y, width, height, color, outlined);
                        rect.draw(context);
                        context.closePath();
                    }
                })
            }

        }
        else {
            context.clearRect(0, 0, width, height);
        }
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

    const penDraw = (e) => {
        const context = contextRef.current;
        const { offsetX, offsetY } = e;

        context.lineCap = lineCap;
        context.lineJoin = lineJoin;
        context.lineWidth = strokeWidth;
        context.strokeStyle = strokeColor;

        context.lineTo(offsetX, offsetY);
        context.stroke();

        const data = {
            type: "line",
            x1: startDrawPositionRef.current.x,
            y1: startDrawPositionRef.current.y,
            x2: offsetX,
            y2: offsetY,
            strokeColor: strokeColor,
            strokeWidth: strokeWidth
        }

        drawDataBufferRef.current.push(data);
        startDrawPositionRef.current = { x: offsetX, y: offsetY };
    }

    const drawShape = (e, shape) => {
        const context = contextRef.current;
        const { offsetX, offsetY } = e;

        context.clearRect(0, 0, width, height);

        drawUpdate();

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

            context.closePath();
        }


    }

    const clear = () => {
        drawDataRef.current = [];
        drawUpdate();
        dispatch(actions.clearImageDataSuccess());
    }

    const undo = () => {
        if(drawDataRef.current.length > 0){
            cacheDrawDataRef.current.push(drawDataRef.current.pop());
        }
        
        drawUpdate();
        dispatch(actions.undoSuccess());
    }

    const redo = () => {
        if (cacheDrawDataRef.current.length > 0) {
            drawDataRef.current.push(cacheDrawDataRef.current.pop());
            drawUpdate();      
        }
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
