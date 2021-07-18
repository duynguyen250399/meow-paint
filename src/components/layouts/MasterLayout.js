import React from 'react';
import SideNav from './SideNav';

function MasterLayout({ children }) {
    return (
        <div className='layout'>
            <SideNav />
            <div className='page-container'>
                { children }
            </div>
        </div>
    )
}

export default MasterLayout
