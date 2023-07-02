import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import StatusTest from "../../components/TestComponents/status";
import GraphTest from "../../components/TestComponents/graphTest";
import Console from "../../components/Console";
import "./index.css";


const Dashboard = (props) => {
    const navigate = useNavigate();
    const [name, setName] = useState();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if(token) {
            const user = JSON.parse(atob(token.split('.')[1]));
            if(!user) {
                localStorage.removeItem('token');
                navigate('/');
            } else {
                console.log(user.name + " is logged in");
                setName(user.name);
            }
        } else {
            navigate('/');
        }
    }, [navigate]);

    return <>
        <h1>welcome to your dashboard, {name}</h1>
        <StatusTest />
        <GraphTest />
        <Console />
    </>

}

export default Dashboard;