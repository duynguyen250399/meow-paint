import React, { useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import Canvas from '../../components/Canvas';
import { PaintAction } from '../../constants';
import { selectStrokeColor } from '../../redux/slices/color';

function Home() {

    const [canvasCursor, setCanvasCursor] = useState('/cursors/pencil.png');

    const strokeColor = useSelector(selectStrokeColor);

    return (
        <div className='home-page'>
            <Canvas 
                strokeColor={strokeColor}
                fillColor='#000'
                strokeWidth={3}
                width={window.innerWidth}
                height={window.innerHeight}
                lineCap='round'
                lineJoin='round'
                paintAction={PaintAction.PEN}
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
