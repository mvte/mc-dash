import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Status from "../status";


const Dashboard = (props) => {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if(token) {
            const user = JSON.parse(atob(token.split('.')[1]));
            if(!user) {
                localStorage.removeItem('token');
                navigate('/');
            } else {
                console.log(user);
            }
        } else {
            navigate('/');
        }
    });

    return <>
        <h1>welcome to your dashboard</h1>
        <Status />
    </>;

};

export default Dashboard;