import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SignIn = (props) => {
    const [username, setUsername] = useState('')
	const [password, setPassword] = useState('')
    
    const navigate = useNavigate();

	async function loginUser(event) {
        event.preventDefault();

		const response = await fetch('http://localhost:9000/api/login', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				username,
				password,
			}),
		})

		const data = await response.json()

		if (data.user) {
			localStorage.setItem('token', data.user);
			navigate('/home');
		} else {
			alert('your username or password is incorrect')
		}

        event.preventDefault();
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