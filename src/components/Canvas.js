import React, { useRef, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { PaintAction } from '../constants';
import { actions } from '../redux/slices';
import { selectClear, selectImageDataArray, selectImageDataIndex, selectRedo, selectUndo } from '../redux/slices/imageData';
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
    const [dataIndexState, setDataIndexState] = useState();

    const isClear = useSelector(selectClear);
    const isUndo = useSelector(selectUndo);
    const isRedo = useSelector(selectRedo);
    const imageDataIndex = useSelector(selectImageDataIndex);
    const imageDataArray = useSelector(selectImageDataArray);


    const dispatch = useDispatch();

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

        setDataIndexState(imageDataIndex);

        if (isClear) {
            clear();
        }

        if (isUndo) {
            undo();
        }

        if (isRedo) {
            redo();
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

    const penDraw = (e) => {
        const { offsetX, offsetY } = e;

        const context = contextRef.current;

        context.lineCap = lineCap;
        context.lineJoin = lineJoin;
        context.lineWidth = strokeWidth;
        context.strokeStyle = strokeColor;

        context.lineTo(offsetX, offsetY);
        context.stroke();
    }

    const draw = ({ nativeEvent }) => {

        if (drawing) {
            switch (paintAction) {
                case PaintAction.PEN:
                    penDraw(nativeEvent);
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

            context.stroke();
            context.closePath();
        }

        const imageData = context.getImageData(0, 0, width, height);

        dispatch(actions.addImageData({ data: imageData }));
    }

    const clear = () => {
        const context = contextRef.current;
        context.clearRect(0, 0, width, height);
        dispatch(actions.clearImageDataSuccess());

        const initialImageData = context.getImageData(0, 0, width, height);
        dispatch(actions.addImageData({ data: initialImageData }));
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

    return (
        <canvas
            ref={canvasRef}
            onMouseDown={startDraw}
            onMouseUp={stopDraw}
            onMouseMove={draw}
            style={{ ...style, cursor: `url(${cursorImage}) ${cursorOffsetX} ${cursorOffsetY}, auto` }}
            className={className}
        >

        </canvas>
    )
}

export default Canvas
