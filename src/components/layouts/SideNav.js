import React from 'react';
import { ReactComponent as Logo } from "../../assets/images/logo.svg";

function SideNav() {
    return (
        <div className='side-nav'>
            <div className='side-nav__app-logo'>
                <a href="/">
                    <Logo className='side-nav__app-logo__logo' width={32} height={32} />
                </a>
                <span>Meow Paint</span>
            </div>
        </div>
    )
}

export default SideNav;