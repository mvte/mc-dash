import Version from '../../components/SettingsSections/Version';
import Identity from '../../components/SettingsSections/Identity';
import Properties from '../../components/SettingsSections/Properties';
import Players from '../../components/SettingsSections/Players';

import { styled } from "@mui/material/styles"; 

const SettingsPage = styled('div')({
    paddingLeft: '1rem',
    paddingRight: '1rem',
    display: 'inline-flex',
    flexDirection: 'column',
    gap: '32px',
});

const Settings = () => {
    const versions = ['1.20', '1.20.1', '1.20.2', '1.20.3', '1.20.4'];

    return (
        <SettingsPage>
            <Identity />
            <Version 
                versions={versions}
            />
            <Properties />
            <Players />
        </SettingsPage>
    )
}

export default Settings;