import React from 'react';
import  { Link } from 'react-router-dom';
import * as BsIcons from 'react-icons/bs';
import './index.css';

const Sidebar = (props) => {
    const { collapsed, handleToggleCollapse } = props;
    const iconSize = 20;
  
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
            path: '/',
            icon: <BsIcons.BsBoxArrowRight size={iconSize}/>
        },
    ];

    function handleLogout() {
        console.log("calling handle logout");
        if(localStorage.getItem('token'))
            localStorage.removeItem('token');
    }

    return (
        <div className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
            <button className={`toggle-button ${collapsed ? 'collapsed' : ''}`} onClick={handleToggleCollapse}>
                {collapsed ? <BsIcons.BsChevronRight size={iconSize}/> : <>menu <BsIcons.BsChevronLeft size={iconSize}/></>}
            </button>
            <ul className="menu-items">
                {menuItems.map((item, index) => (
                    <li key={index} className="menu-item" onClick={item.name === "logout" ? handleLogout : null}>
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
