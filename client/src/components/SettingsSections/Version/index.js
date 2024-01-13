import { ArrowDropDown } from '@mui/icons-material';
import { H1, Panel, P, ComboBox, SettingsInput, StyledInputAdornment } from '../SettingsConsts'
import { Autocomplete, Grid, InputAdornment } from '@mui/material';

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
                                    placeholder="current version"
                                    options={props.versions}
                                />
                            </Grid>
                        </Grid>
                    </Panel>
                </Grid>
                <Grid item xs={6}>
                    <Panel>
                        <Grid container spacing={2} alignItems="center">
                            <Grid item xs={4} >
                                <P> type </P>
                            </Grid>
                            <Grid item xs={8}>
                                <ComboBox 
                                    id="type"
                                    placeholder="current type"
                                    options={props.versions}
                                />
                            </Grid>
                        </Grid>
                    </Panel>
                </Grid>
            </Grid>
        </div>
    )
}

export default Version;