import React, { useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import Canvas from '../../components/Canvas';
import { actions } from '../../redux/slices';
import { selectPaintAction } from '../../redux/slices/app';
import { selectFillColor, selectStrokeColor } from '../../redux/slices/color';

function Home() {
    
    const dispatch = useDispatch();

    const [canvasCursor, setCanvasCursor] = useState('/cursors/pencil.png');

    const strokeColor = useSelector(selectStrokeColor);
    const fillColor = useSelector(selectFillColor);
    const paintAction = useSelector(selectPaintAction);

    const onChangeDrawData = (data) =>{
        const isDisabledSaveButton = data.length <= 0;
        dispatch(actions.changeSaveButtonStatus({ status: isDisabledSaveButton }));
    }

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
                onChangeData={onChangeDrawData}
            />
        </div>
    )
}

export default Home
