import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Grid from '@mui/material/Grid';
import StartStop from "../../components/Cards/StartStop";
import StatusTest from "../../components/TestComponents/status";
import GraphTest from "../../components/TestComponents/graphTest";
import "./index.css";

import Welcome from "../../components/Cards/Welcome";
import Info from "../../components/Cards/Info";
import Players from "../../components/Cards/Players";
import Files from "../../components/Cards/Files";
import CPU from "../../components/Cards/CPU";
import Memory from "../../components/Cards/Memory";

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

    const players = [];
    for(let i = 0; i < 10; i++) {
        players.push({
            name: "player" + i,
            uuid: "13020100-a2f2-4367-b671-1449011eda6f",
            icon: "https://crafatar.com/avatars/13020100-a2f2-4367-b671-1449011eda6f?size=32&overlay"
        });
    }

    return <>
        <Grid container spacing={2}>
            <Grid item xs={9}>
                <Welcome user={name} players={0}/>
            </Grid>
            <Grid item xs={3}>
                <StartStop />
            </Grid>
            <Grid item xs={4}>
                <Info
                    ip="play.mvte.net"
                    status="online"
                    uptime="1d 2h 3m"
                    version="fabric - 1.20.2"
                    motd="woo we love minecraft!"
                    players={0}
                    maxPlayers={2}
                 />
            </Grid>
            <Grid item xs={4}>
                <Players players={players} maxPlayers={2} />  
            </Grid>
            <Grid item xs={4}>
                <Files />
            </Grid>
            <Grid item xs={6}>
                <CPU />
            </Grid>
            <Grid item xs={6}>
                <Memory />
            </Grid>
            <Grid item xs={6}>
                <StatusTest />
            </Grid>
            <Grid item xs={6}>
                <GraphTest />
            </Grid>
        </Grid>
        
        
    </>
}

export default Dashboard;