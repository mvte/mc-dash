import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const SignIn = (props) => {
    const [username, setUsername] = useState('')
	const [password, setPassword] = useState('')
    
    const navigate = useNavigate();

    async function loginUser(event) {
        event.preventDefault();
    
        try {
            const response = await axios.post('api/login', {
                username,
                password,
            }, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
    
            const data = response.data;
    
            if (data.user) {
                localStorage.setItem('token', data.user);
                navigate('/home');
            } else {
                alert('your username or password is incorrect');
            }
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div>
            <h1>hello</h1>
            <form onSubmit={loginUser}>
                <input 
                    value={username}
					onChange={(e) => setUsername(e.target.value)}
                    name="username" 
                    type="text" 
                    placeholder="username" 

                    />
                <input 
                    value={password}
				    onChange={(e) => setPassword(e.target.value)}
                    name="password" 
                    type="password" 
                    placeholder="password"
                />
                <button type="submit">sign in</button>
            </form>
        </div>
    )
}

export default SignIn;