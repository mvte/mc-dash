import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Grid from '@mui/material/Grid';
import StatusTest from "../../components/TestComponents/status";
import GraphTest from "../../components/TestComponents/graphTest";
import "./index.css";

import StartStop from "../../components/Cards/StartStop";
import Welcome from "../../components/Cards/Welcome";
import Info from "../../components/Cards/Info";
import Players from "../../components/Cards/Players";
import Files from "../../components/Cards/Files";
import CPU from "../../components/Cards/CPU";
import Memory from "../../components/Cards/Memory";
import axios from "axios";

const Dashboard = (props) => {
    const navigate = useNavigate();
    const [name, setName] = useState();
    const [glance, setGlance] = useState({
        ip: "loading...",
        status: "loading...",
        version: "loading...",
        motd: "loading...",
        playersOn: "loading...",
        maxPlayers: "loading...",
        uptime: "loading..."
    });
    const [playerList, setPlayerList] = useState([]);
    const [tree, setTree] = useState({});


    const updateStatus = async () => {
        await axios.get("api/info/status") //this route gets the server status
          .then(res => {
                setGlance(g => {
                    return {
                        ...g,
                        ip: res.data.host,
                        status: res.data.online ? "online" : "offline",
                        version: res.data.version?.name_clean,
                        motd: res.data.motd?.clean,
                        playersOn: res.data.players?.online,
                        maxPlayers: res.data.players?.max
                    }
                });

                let players = [];
                let list = res.data.players.list;
                for(let i = 0; i < list.length; i++) {
                    players.push({
                        name: list[i]?.name_clean,
                        uuid: list[i]?.uuid,
                        icon: "https://crafatar.com/avatars/" + list[i].uuid + "?size=32&overlay"
                    });
                }

                setPlayerList(players);
          })
          .catch(err => {
              console.log(err);
          });
      }

      const updateUptime = async () => {
        await axios.get("api/performance/uptime") //this route gets the server uptime in milliseconds
            .then(res => {
                setGlance(g => {
                    return {
                        ...g,
                        uptime: res.data.uptime
                    }
                });
            })
            .catch(err => {
                console.log(err);
            });
    }

    const updateTree = async () => {
        await axios.get("api/datagrab/tree")
            .then(res => {
                console.log(res.data);
                setTree(res.data);
            })
            .catch(err => {
                console.log(err);
            });
    }

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
        
        updateStatus();
        updateUptime();
        updateTree();

        const timer = setInterval(() => {
            updateStatus();
            updateUptime();
            console.log('updating status and uptime');
        }, 1000*60*2);

        return () => clearInterval(timer);
    }, [navigate]);

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
                    ip={glance.ip}
                    status={glance.status}
                    uptime={glance.uptime}
                    version={glance.version}
                    motd={glance.motd}
                    players={glance.playersOn}
                    maxPlayers={glance.maxPlayers}
                 />
            </Grid>
            <Grid item xs={4}>
                <Players players={playerList} maxPlayers={glance.maxPlayers} />  
            </Grid>
            <Grid item xs={4}>
                <Files tree={tree}/>
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