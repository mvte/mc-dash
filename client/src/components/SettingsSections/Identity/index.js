import { Panel, H1, P, SettingsInput, SettingsButton } from '../SettingsConsts'
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Grid from '@mui/material/Grid';

const Identity = (props) => { 

    return (
        <div>
            <H1>identity</H1>
            <Panel>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={2} >
                        <P> message of the day </P>
                    </Grid>
                    <Grid item xs={10}>
                        <SettingsInput
                            id="motd"
                            placeholder={props.motd}
                            fullWidth
                            size="small"
                            autoComplete="off"
                        />
                    </Grid>
                    <Grid item xs={2}>
                        <P> server icon </P>
                    </Grid>
                    <Grid item xs={10} sx = {{display: "flex", alignItems: "center", gap: "24px"}}>
                        <SettingsButton variant="contained" startIcon={<CloudUploadIcon />}>
                            upload
                        </SettingsButton>
                        <img src="/api/datagrab/icon" alt="server icon"/>
                    </Grid>
                </Grid>
            </Panel>
        </div>
    )
}

export default Identity;