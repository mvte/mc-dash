import { H1, Panel, P, ComboBox,} from '../SettingsConsts'
import { Grid } from '@mui/material';
import { useState } from 'react';

const Version = (props) => {
    const getCompatibleVersions = (type) => {
        if(props.compatibility) {
            return props.compatibility[type];
        }
        else {
            return [];
        }
    }
    const [compatibleVersions, setCompatibleVersions] = useState(getCompatibleVersions(props.type));

    const onTypeChange = (_, value) => {
        console.log("change detected", value);
        setCompatibleVersions(getCompatibleVersions(value));
    }

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
                                    onInputChange={onTypeChange}
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