import React from 'react';
import { useSelector, useDispatch } from "react-redux";
import { ReactComponent as Logo } from "../../assets/images/logo.svg";
import { ReactComponent as RedoIcon } from "../../assets/icons/redo.svg";
import { ReactComponent as UndoIcon } from "../../assets/icons/undo.svg";
import { ReactComponent as SaveIcon } from "../../assets/icons/save.svg";
import { ReactComponent as ResetIcon } from "../../assets/icons/reset.svg";
import { actions } from '../../redux/slices';
import { selectFillColor, selectStrokeColor } from '../../redux/slices/color';
import ColorPicker from '../ColorPicker';
import Button from '../Button';
import { colors } from '../../constants/theme';
import { selectImageDataArray, selectImageDataIndex } from '../../redux/slices/imageData';

function SideNav() {

    const strokeColor = useSelector(selectStrokeColor);
    const fillColor = useSelector(selectFillColor);
    const imageDataIndex = useSelector(selectImageDataIndex);
    const imageDataArray = useSelector(selectImageDataArray);

    const dispatch = useDispatch();

    const onSaveStrokeColor = (hexColor) => {
        dispatch(actions.changeStrokeColor({
            value: hexColor
        }))
    }

    const onSaveFillColor = (hexColor) => {
        dispatch(actions.changeFillColor({
            value: hexColor
        }))
    }

    const onResetPaintBoard = () =>{
        dispatch(actions.clearImageData());
    }

    const onUndo = () =>{
        let index = imageDataIndex > 0 ? imageDataIndex - 1 : 0;
        dispatch(actions.undo({ index }));
    }

    const onRedo = () =>{
        let index = imageDataIndex < imageDataArray.length - 1 ? imageDataIndex + 1 : imageDataArray.length - 1;
        dispatch(actions.redo({ index }));
    }

    return (
        <div className='side-nav'>
            <div className='side-nav__app-logo'>
                <a href="/">
                    <Logo className='side-nav__app-logo__logo' width={32} height={32} />
                </a>
                <span>Meow Paint</span>
            </div>

            <div className='side-nav__container'>
                <div className='side-nav__container__toolbar'>
                    {/* Stroke Color Picker */}
                    <ColorPicker
                        elementClassName='stroke-color-picker'
                        title='Stroke Color'
                        color={strokeColor}
                        valueText={strokeColor}
                        onChange={onSaveStrokeColor}
                    />

                    {/* Fill Color Picker */}
                    <ColorPicker
                        elementClassName='fill-color-picker'
                        className='mt-2'
                        title='Fill Color'
                        color={fillColor}
                        valueText={fillColor}
                        onChange={onSaveFillColor}
                    />

                    {/* Undo and Redo */}
                    <div className='d-flex mt-2'>
                        <Button
                            bgColor='#fff'
                            className='flex-center w-100'
                            padding={5}
                            onClick={onUndo}
                        >
                            <span className='mr-2'>Undo</span>
                            <UndoIcon width={17} height={17} />
                        </Button>
                        <Button
                            bgColor='#fff'
                            className='flex-center w-100'
                            padding={5}
                            onClick={onRedo}
                        >
                            <span className='mr-2'>Redo</span>
                            <RedoIcon width={17} height={17} />
                        </Button>
                    </div>
                </div>

                <div>
                    <Button
                        bgColor={colors.secondary}
                        className='w-100 mb-1'
                        padding={10}
                        hoverColor={colors.secondaryLight}
                        onClick={onResetPaintBoard}
                    >
                        <ResetIcon width={17} height={17} className='mr-2' />
                        <span style={{ color: '#fff' }}>Reset Paint Board</span>
                    </Button>

                    <Button
                        bgColor={colors.primary}
                        className='w-100'
                        padding={10}
                        hoverColor={colors.primaryLight}
                    >
                        <SaveIcon width={17} height={17} className='mr-2' />
                        <span style={{ color: '#fff' }}>Save</span>
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default SideNav;