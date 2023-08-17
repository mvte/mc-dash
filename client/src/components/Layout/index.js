import { Outlet } from 'react-router-dom';
import { useState } from 'react';
import './index.css';
import Sidebar from '../Sidebar';

const Layout = () => {
    const [collapsed, setCollapsed] = useState(false);

    const handleToggleCollapse = () => {
        setCollapsed(!collapsed);
    };

    return <>
        <div className='page'>
            <Sidebar 
                title='Dashboard'
                collapsed={collapsed}
                handleToggleCollapse={handleToggleCollapse}
            />
            <div className={`container ${collapsed ? 'collapsed' : ''}`}>
                <Outlet />
            </div>
        </div>
    </>
}

export default Layout