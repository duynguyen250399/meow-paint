import React, { useRef, useEffect, useState } from 'react';
import { PaintAction } from '../constants';
import { fillCircle } from '../utils/drawHelper';

function Canvas({
    strokeColor,
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

    const [drawing, setDrawing] = useState(false);

    useEffect(() => {
        const canvas = canvasRef.current;
        contextRef.current = canvas.getContext('2d');
        canvas.width = width;
        canvas.height = height;

        fillBackground();
    }, [])

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
    }

    return (
        <canvas
            ref={canvasRef}
            onMouseDown={startDraw}
            onMouseUp={stopDraw}
            onMouseMove={draw}
            style={style}
            className={className}
        >

        </canvas>
    )
}

export default Canvas
