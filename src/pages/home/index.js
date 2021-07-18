import React from 'react';
import Canvas from '../../components/Canvas';
import { PaintAction } from '../../constants';

function Home() {
    return (
        <div className='home-page'>
            <Canvas 
                strokeColor='#000'
                fillColor='#000'
                strokeWidth={3}
                width={window.innerWidth}
                height={window.innerHeight}
                lineCap='round'
                lineJoin='round'
                paintAction={PaintAction.PEN}
                bgColor='#fff'
                className='canvas'
            />
        </div>
    )
}

export default Home
