import { Card } from "../CardConsts";
import { styled } from "@mui/material/styles";

const Info = (props) => {
    let online = props.status === "online";
    let starting = props.status === "starting";
    const NoBullets = styled('ul')`
        list-style-type: none;
        padding-bottom: 2rem;
    `;

    const convertUptime = (uptime) => {
        let ms = uptime;
        let minutes = Math.floor((ms / (1000 * 60)) % 60);
        let hours = Math.floor((ms / (1000 * 60 * 60)) % 24);
        let days = Math.floor((ms / (1000 * 60 * 60 * 24)) % 365);

        let uptimeString = "";
        if (days > 0) uptimeString += `${days}d `;
        if (hours > 0) uptimeString += `${hours}h `;
        if (minutes > 0) uptimeString += `${minutes}m `;

        return uptimeString;
    }

    return <>
        <Card>
            at a glance
            <NoBullets>
                <li><b>ip:</b> {props.ip} </li>
                <li>
                    <b>status:</b> {
                        online ? 
                        <span style={{color: "green"}}>online</span> :
                        starting ?
                        <span style={{color: "lightblue"}}>starting...</span> :
                        <span style={{color: "red"}}>offline</span>
                    }
                </li>
                <li>
                    uptime: {convertUptime(props.uptime)}  
                </li>
                <li>
                    <b>version:</b> {props.version}
                </li>
                <li>
                    <b>motd:</b> {props.motd}
                </li>
                <li>
                    <b>players:</b> {props.players}/{props.maxPlayers}
                </li>
            </NoBullets>
        </Card>
    </>
};

export default Info;

/*
 - server info
        - name/ip
        - status
        - version/server type
        - motd
        - num players
*/