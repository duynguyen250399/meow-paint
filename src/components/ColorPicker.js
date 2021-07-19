import React, { useEffect, useRef } from 'react';
import Pickr from "@simonwep/pickr";

function ColorPicker({
    elementClassName,
    title,
    clear = false,
    save = false,
    valueText,
    color,
    onChange,
    onSave,
    onClear,
    className
}) {

    const colorPickerRef = useRef();

    useEffect(() => {
        colorPickerRef.current = Pickr.create({
            el: `.${elementClassName}`,
            theme: 'nano', // or 'monolith', or 'nano'
            autoReposition: true,
            closeOnScroll: true,
            useAsButton: true,
            default: color,
            swatches: [
                'rgba(244, 67, 54, 1)',
                'rgba(233, 30, 99, 0.95)',
                'rgba(156, 39, 176, 0.9)',
                'rgba(103, 58, 183, 0.85)',
                'rgba(63, 81, 181, 0.8)',
                'rgba(33, 150, 243, 0.75)',
                'rgba(3, 169, 244, 0.7)',
                'rgba(0, 188, 212, 0.7)',
                'rgba(0, 150, 136, 0.75)',
                'rgba(76, 175, 80, 0.8)',
                'rgba(139, 195, 74, 0.85)',
                'rgba(205, 220, 57, 0.9)',
                'rgba(255, 235, 59, 0.95)',
                'rgba(255, 193, 7, 1)'
            ],

            components: {

                // Main components
                preview: true,
                opacity: true,
                hue: true,

                // Input / output Options
                interaction: {
                    hex: true,
                    rgba: true,
                    input: true,
                    clear,
                    save
                }
            }
        });

        // Listen color picker events
        colorPickerRef.current
            .on('save', (color, instance) => {
                const colorHexCode = color.toHEXA().toString();
                if (onSave) onSave(colorHexCode);
            }).on('clear', instance => {
                if (onClear) onClear();
            }).on('change', (color, source, instance) => {
                const colorHexCode = color.toHEXA().toString();
                if (onChange) onChange(colorHexCode);
            })
    }, [])

    return (
        <div className={className}>
            <div className='title-color-picker'>{title}</div>
            <button className={`${elementClassName} btn-color-picker`}>
                <div style={{ backgroundColor: color }} className='color-review'></div>
                <div className='value-text-color-picker'>{valueText}</div>
            </button>
        </div>
    )
}

export default ColorPicker
