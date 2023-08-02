import React, { useState } from 'react';
import  { Link } from 'react-router-dom';
import * as BsIcons from 'react-icons/bs';
import './index.css';

const Sidebar = () => {
    const [collapsed, setCollapsed] = useState(false);
    const iconSize = 20;

    const handleToggleCollapse = () => {
        setCollapsed(!collapsed);
    };
  
    const menuItems = [
        {
            name: 'home',
            path: '/home',
            icon: <BsIcons.BsHouseDoorFill size={iconSize}/>,
        },
        {
            name: 'console',
            path: '/console',
            icon: <BsIcons.BsTerminalFill size={iconSize}/>,
        },
        {
            name: 'settings',
            path: '/settings',
            icon: <BsIcons.BsGearFill size={iconSize}/>,
        },
        {
            name: 'map',
            path: '/map',
            icon: <BsIcons.BsMap size={iconSize}/>,
        },
        {
            name: 'logout',
            path: '/logout',
            icon: <BsIcons.BsBoxArrowRight size={iconSize}/>,
        }
    ];


    return (
        <div className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
            <button className={`toggle-button ${collapsed ? 'collapsed' : ''}`} onClick={handleToggleCollapse}>
                {collapsed ? <BsIcons.BsChevronRight size={iconSize}/> : <>menu <BsIcons.BsChevronLeft size={iconSize}/></>}
            </button>
            <ul className="menu-items">
                {menuItems.map((item, index) => (
                    <li key={index} className="menu-item">
                    <Link to={item.path}>
                        {collapsed ? item.icon : item.name}
                    </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
 };

export default Sidebar;
