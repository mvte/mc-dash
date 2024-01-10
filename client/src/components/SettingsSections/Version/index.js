import { H1, Panel, P, ComboBox, SettingsInput } from '../SettingsConsts'
import { Grid, TextField } from '@mui/material';

const Version = (props) => {

    return (
        <div>
            <H1>version</H1>
            <Grid container spacing={4} >
                <Grid item xs={6}>
                    <Panel>
                        <Grid container spacing={2} alignItems="center">
                            <Grid item xs={4} >
                                <P> version </P>
                            </Grid>
                            <Grid item xs={8}>
                                <ComboBox 
                                    id="version"
                                    options={props.versions}
                                    size="small"
                                    renderInput={(params) => 
                                        <div ref ={params.InputProps.ref}>
                                            <SettingsInput {...params.InputProps}/>
                                        </div>
                                    }
                                />
                            </Grid>
                        </Grid>
                    </Panel>
                </Grid>
                <Grid item xs={6}>
                    <Panel>
                        <P>type</P>
                    </Panel>
                </Grid>
            </Grid>
        </div>
    )
}

export default Version;