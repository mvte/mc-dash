import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';
import { Button, CssBaseline, TextField, Box, Typography, Container, Snackbar, Alert } from '@mui/material';

const SignUp = (props) => {
    const navigate = useNavigate();
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: ''
    });

    async function handleSubmit(event) {
        event.preventDefault();
        const data = new FormData(event.currentTarget);

        const username = data.get('username');
        const password = data.get('password');
        const confirmPassword = data.get('confirmPassword');

        if(verifyUserNameReqs(username) && verifyPasswordReqs(password, confirmPassword)) {
            try {
                const response = await axios.post('api/register', {
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
                    setSnackbar({
                        open: true,
                        message: data.error,
                    })
                }
            } catch (error) {
                console.error(error);
            }
        }
    }

    function verifyPasswordReqs(password, confirmPassword) {
        //password must be greater than 8 characters long
        if(password.length < 8) {
            setSnackbar({
                open: true,
                message: 'password must be at least 8 characters long'
            });
            return false;
        }
        if(password !== confirmPassword) {
            setSnackbar({
                open: true,
                message: 'passwords do not match'
            });
            return false;
        }

        return true;
    }

    function verifyUserNameReqs(username) {
        if(username.length < 3) {
            setSnackbar({
                open: true,
                message: 'username must be at least 3 characters long'
            });
            return false;
        }

        return true;
    }

    return (<>
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
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="confirmPassword"
                        label="confirm password"
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
                        Sign Up
                    </Button>
                    <Typography component="p" variant="p">
                        already have an account? <a href="/">sign in</a>
                    </Typography>
                </Box>
            </Box>
        </Container>
        <Snackbar
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'center',
            }}
            open={snackbar.open}
            autoHideDuration={6000}
            onClose={() => setSnackbar({open: false, message: ''})}
        >
            <Alert onClose={() => setSnackbar({open: false, message: ''})} severity="error" sx={{ width: '100%' }}>
                {snackbar.message}
            </Alert>
        </Snackbar>
    </>);
}

export default SignUp;