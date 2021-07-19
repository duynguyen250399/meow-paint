import React from 'react';

function IconButton({
    onClick,
    outlined,
    borderRadius = 2,
    padding = 5,
    color,
    iconRender,
    style,
    className
}) {

    const getStyle = () =>{
        if(outlined){
            return {
                borderRadius,
                border: `1px solid ${color}`,
                padding,
                background: 'none'
            }
        }
        else{
            return {
                borderRadius,
                padding,
                background: color ? color : 'none',
                border: 'none'
            }
        }
    }
    
    const buttonStyle = getStyle();

    return (
        <button 
            style={{...buttonStyle, style}}
            onClick={onClick}
            className={className}
        >
            {
                iconRender()
            }
        </button>
    )
}

export default IconButton
