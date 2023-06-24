import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import './index.css';


const Sb = (props) => {
    return (
        <div className="sidebar">
            <Sidebar
                title={props.title}
                collapsed={props.collapsed}
                backgroundColor='#121212'
                rootStyles={{
                    color: '#121212',
                    backgroundColor: '#121212',
                    height: '100vh',
                }}
            >
                <Menu
                    menuItemStyles={{
                        backgroundColor: '#121212',
                    }}
                >
                    <SubMenu title="Dashboard">
                        <MenuItem>Home</MenuItem>
                        <MenuItem>Test</MenuItem>
                    </SubMenu>
                </Menu>
            </Sidebar>
        </div>
    );
}

export default Sb;