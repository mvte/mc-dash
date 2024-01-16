import { H1, Panel, P, ComboBox,} from '../SettingsConsts'
import { Grid } from '@mui/material';

const Version = (props) => {
    const getCompatibleVersions =  (type) => {
        if(type && props.compatibility) {
            return props.compatibility[type];
        } else if (props.type) {
            return props.compatibility[props.type];
        } else {
            return [];
        }
    }

    const compatibleVersions = getCompatibleVersions(props.type);
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
                                    placeholder={props.version}
                                    options={compatibleVersions}
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
                                    placeholder={props.type}
                                    options={props.compatibility ? Object.keys(props.compatibility) : []}
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