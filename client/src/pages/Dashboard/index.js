import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import StatusTest from "../../components/TestComponents/status";
import GraphTest from "../../components/TestComponents/graphTest";


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
                console.log(user.name + " is logged in");
            }
        } else {
            navigate('/');
        }
    });

    return <>
        <h1>welcome to your dashboard</h1>
        <StatusTest />
        <GraphTest />
    </>

}

export default Dashboard;