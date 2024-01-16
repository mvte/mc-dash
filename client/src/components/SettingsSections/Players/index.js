import { Grid } from '@mui/material';
import { Panel, H1, P, SettingsInput } from '../SettingsConsts'

const Players = (props) => {
    let whitelist = "", oplist = "", banlist = "";
    let players = {};
    if(props.whitelist) {
        for(let i = 0; i < props.whitelist.length; i++) {
            whitelist += props.whitelist[i].name + "\n";
        }

        players.whitelist = whitelist;
    }
    if(props.ops) {
        for(let i = 0; i < props.ops.length; i++) {
            oplist += props.ops[i].name + "\n";
        }

        players.oplist = oplist;
    }
    if(props.bannedPlayers) {
        for(let i = 0; i < props.bannedPlayers.length; i++) {
            banlist += props.bannedPlayers[i].name + "\n";
        }
    }
    if(props.bannedIps) {
        for(let i = 0; i < props.bannedIps.length; i++) {
            banlist += props.bannedIps[i].ip + "\n";
        }
    }
    players.banlist = banlist;

    return (
        <div>
            <H1>players</H1>
            <span style={{color: "gray"}}><i>(these lists are read only. please use the console to whitelist, op, or ban players)</i></span>
            <Grid container spacing={4} >
                <Grid item xs={4}>
                    <Panel >
                        <P>whitelist</P>
                        <SettingsInput 
                            fullWidth
                            readOnly
                            multiline={true}
                            minRows={5}
                            maxRows={10}
                            value={players.whitelist || "(empty)"}
                        />
                    </Panel>
                </Grid>
                <Grid item xs={4}>
                    <Panel>
                        <P>oplist</P>
                        <SettingsInput 
                            fullWidth
                            readOnly
                            multiline
                            minRows={5}
                            maxRows={10}
                            value={players.oplist || "(empty)"}
                        />
                    </Panel>
                </Grid>
                <Grid item xs={4}>
                    <Panel>
                        <P>banlist</P>
                        <SettingsInput 
                            fullWidth
                            readOnly
                            multiline
                            minRows={5}
                            maxRows={10}   
                            value={players.banlist || "(empty)"} 
                        />
                    </Panel>
                </Grid>
            </Grid>
        </div>
    )
}

export default Players;