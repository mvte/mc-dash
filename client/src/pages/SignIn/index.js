import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';

const SignIn = (props) => {
    const navigate = useNavigate();

    async function handleSubmit(event) {
        event.preventDefault();
        const data = new FormData(event.currentTarget);

        const username = data.get('username');
        const password = data.get('password');
        try {
            const response = await axios.post('api/login', {
                username: username,
                password: password
            }, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
    
            const data = response.data;
    
            if (data.ok) {
                localStorage.setItem('token', data.token);
                navigate('/home');
            } else {
                alert('your username or password is incorrect');
            }
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Typography component="h1" variant="h5">
                    hello                       
                </Typography>
                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="username"
                        label="username"
                        name="username"
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="password"
                        type="password"
                        id="password"
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="secondary"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Sign In
                    </Button>
                </Box>
            </Box>
        </Container>
    );
}

export default SignIn;