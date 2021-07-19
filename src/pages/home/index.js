import React, { useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import Canvas from '../../components/Canvas';
import { PaintAction } from '../../constants';
import { selectPaintAction } from '../../redux/slices/app';
import { selectFillColor, selectStrokeColor } from '../../redux/slices/color';

function Home() {

    const [canvasCursor, setCanvasCursor] = useState('/cursors/pencil.png');

    const strokeColor = useSelector(selectStrokeColor);
    const fillColor = useSelector(selectFillColor);
    const paintAction = useSelector(selectPaintAction);

    return (
        <div className='home-page'>
            <Canvas 
                strokeColor={strokeColor}
                fillColor={fillColor}
                strokeWidth={3}
                width={window.innerWidth}
                height={window.outerHeight}
                lineCap='round'
                lineJoin='round'
                paintAction={paintAction}
                bgColor='#fff'
                className='canvas'
                cursorImage={canvasCursor}
                cursorOffsetX={0}
                cursorOffsetY={24}
            />
        </div>
    )
}

export default Home
