import { styled } from "@mui/material/styles";
import InputBase from '@mui/material/InputBase';
import { Button, Autocomplete, TextField } from "@mui/material";

const Panel = styled('div')`
    background-color: #2c2f33;
    border-radius: 10px;
    padding: 20px;
    box-shadow: 0 0 10px rgba(0,0,0,0.5);
    color: #fff;
`
const H1 = styled('h1')`
    margin: 0;
    padding: 0;
`

const P = styled('p')`
    margin: 0;
    padding: 0; 
`

const SettingsInput = styled(TextField)({
    '& .MuiInputBase-input': {
        color: '#1E1E1E',
        backgroundColor: 'white',
        borderRadius: '5px',
        height: '30px',
        padding: '0px 10px',
    },
});

const SettingsButton = styled(Button)`
    text-transform: none;
`

const ComboBox = styled(Autocomplete)({

})

export { Panel, H1, P, SettingsInput, SettingsButton, ComboBox };