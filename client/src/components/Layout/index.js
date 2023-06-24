import { Outlet } from 'react-router-dom';
import './index.css';
import Sidebar from '../Sidebar';

const Layout = () => {
    return <>
        <div className='page'>
            <Sidebar 
                title='Dashboard'
                collapsed={false}
            />
            <div className='container'>
                <Outlet />
            </div>
        </div>
    </>
}

export default Layout