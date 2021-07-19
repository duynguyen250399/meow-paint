import { PaintAction } from ".";

export const paintConfig = {
    penMode: {
        icon: '/assets/icons/paintMode/pen.svg',
        label: 'Pen / Pencil',
        description: '',
        action: PaintAction.PEN
    },
    rectFillMode: {
        icon: '/assets/icons/paintMode/rect_fill.svg',
        label: 'Fill Rectange',
        description: '',
        action: PaintAction.RECT_FILL
    },
    rectStrokeMode: {
        icon: '/assets/icons/paintMode/rect_stroke.svg',
        label: 'Outlined Rectange',
        description: '',
        action: PaintAction.RECT_STROKE
    }
}

export const paintModeList = [
    {
        icon: '/assets/icons/paintMode/pen.svg',
        label: 'Pen / Pencil',
        description: '',
        action: PaintAction.PEN
    },
    {
        icon: '/assets/icons/paintMode/rect_fill.svg',
        label: 'Fill Rectangle',
        description: '',
        action: PaintAction.RECT_FILL
    },
    {
        icon: '/assets/icons/paintMode/rect_stroke.svg',
        label: 'Outlined Rectangle',
        description: '',
        action: PaintAction.RECT_STROKE
    }
];