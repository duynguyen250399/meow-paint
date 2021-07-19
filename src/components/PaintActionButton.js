import React from 'react';
import { useDispatch } from "react-redux";
import { paintConfig } from '../constants/paintConfig';
import { actions } from '../redux/slices';
import Button from './Button';

function PaintActionButton({ options, isActive }) {

    const { action, label, icon } = options;

    const dispatch = useDispatch();

    const onChangeAction = () =>{
        dispatch(actions.changePaintAction({ paintAction: action }));
    }

    return (
        <Button
            bgColor='#fff'
            outlined
            className={
                `my-2 side-nav__container__toolbar__btn-paint-tool 
                            ${isActive && 'side-nav__container__toolbar__btn-paint-tool--active'}`
            }
            onClick={onChangeAction}
        >
            <img src={icon} alt={label} />
        </Button>
    )
}

export default PaintActionButton
