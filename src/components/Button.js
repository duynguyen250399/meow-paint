import React, { useState } from 'react';

function Button({
    onClick,
    style,
    className,
    title,
    outlined,
    padding = 5,
    borderRadius = 3,
    borderColor = '#dedede',
    hoverColor = '#dedede',
    borderWidth = 1,
    borderStyle = 'solid',
    bgColor,
    titleStyle,
    children
}) {

    const getStyle = () => {

        const commonStyle = {
            borderRadius,
            padding,
            transition: '0.3s',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }

        if (outlined) {
            return {
                ...commonStyle,
                background: 'none',
                border: `${borderWidth}px ${borderStyle} ${borderColor}`,
                transition: '0.3s'
            }
        }
        else {
            return {
                ...commonStyle,
                background: bgColor ? bgColor : 'none',
                border: 'none'
            }
        }
    }

    const [buttonStyle, setButtonStyle] = useState(getStyle());

    const onHover = (e) =>{
        setButtonStyle({...buttonStyle, backgroundColor: hoverColor});
    }

    const onLeave = (e) =>{
        setButtonStyle({...buttonStyle, backgroundColor: bgColor});
    }

    return (
        <button
            className={className}
            style={{ ...buttonStyle, style }}
            onClick={onClick}
            onMouseOver={onHover}
            onMouseLeave={onLeave}
        >
            {
                children ? children :
                    <span style={titleStyle}>{title}</span>
            }
        </button>
    )
}

export default Button
