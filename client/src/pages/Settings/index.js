import Version from '../../components/SettingsSections/Version';
import Identity from '../../components/SettingsSections/Identity';
import Properties from '../../components/SettingsSections/Properties';
import Players from '../../components/SettingsSections/Players';

import { styled } from "@mui/material/styles"; 
import { useEffect, useState } from 'react';
import axios from 'axios';

const SettingsPage = styled('div')({
    paddingLeft: '1rem',
    paddingRight: '1rem',
    display: 'inline-flex',
    flexDirection: 'column',
    gap: '32px',
});

const Settings = () => {
    // const versions = ['1.20', '1.20.1', '1.20.2', '1.20.3', '1.20.4'];
    const [properties, setProperties] = useState([]);
    const [motd, setMotd] = useState('');
    const [server, setServer] = useState({});
    const [players, setPlayers] = useState({});
    const [formData, setFormData] = useState({});

    const initProperties = async () => {
        try {
            const response = await axios.get('/api/datagrab/properties?allowedOnly=true');
            setProperties(response.data);
        } catch (error) {
            console.error(error);
        }
        
    }
    const initMotd = async () => {
        try {
            const response = await axios.get('/api/datagrab/properties?properties=motd');
            // remove color codes and escape characters
            const cleanMotd = response.data[0].value.replace(/§./g, '').replace(/\\/g, '');
            setMotd(cleanMotd);
        }
        catch (error) {
            console.error(error);
        }
    }
    const initServerVersion = async () => {
        try {
            const versionResponse = await axios.get('/api/datagrab/version');
            const compatibilityResponse = await axios.get('/api/datagrab/version/compatibility');
            setServer({
                version: versionResponse.data.version,
                type: versionResponse.data.type,
                compatibility: compatibilityResponse.data,
            })
        }
        catch (error) {
            console.error(error);
        }
    }
    const initPlayers = async () => {
        try {
            const banlistResponse= await axios.get('/api/datagrab/banlist');
            const oplistResponse = await axios.get('/api/datagrab/oplist');
            const whitelistResponse = await axios.get('/api/datagrab/whitelist');
            setPlayers({
                bannedPlayers: banlistResponse.data.bannedPlayers,
                bannedIps: banlistResponse.data.bannedIps,
                ops: oplistResponse.data,
                whitelist: whitelistResponse.data,
            })
        }
        catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        initProperties();
        initMotd();
        initServerVersion();
        initPlayers();
    }, []);

    const onChange = (e) => {
        setFormData(prev => {
            return {
                ...prev,
                [e.target.id]: e.target.value,
            }
        
        })
        console.log(formData);
    }
    const onOptionsChange = (e, value) => {
        setFormData(prev => {
            return {
                ...prev,
                [e.target.id]: value,
            }
        });
    }

    return (
        <SettingsPage>
            <Identity 
                motd={motd}
                onChange={onChange}
            />
            <Version 
                version={server.version}
                type={server.type}
                compatibility={server.compatibility}
                onOptionsChange={onOptionsChange}
            />
            <Properties 
                properties={properties}
                onChange={onChange}
                onOptionsChange={onOptionsChange}
            />
            <Players 
                bannedPlayers={players.bannedPlayers}
                bannedIps={players.bannedIps}
                ops={players.ops}
                whitelist={players.whitelist}
            />
        </SettingsPage>
    )
}

export default Settings;