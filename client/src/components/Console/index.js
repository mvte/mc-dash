import React, { useState, useEffect, useRef } from "react";
import { Box, TextField, InputAdornment } from "@mui/material";
import io from "socket.io-client";
import axios from "axios";

const Console = (props) => {
    const [inputValue, setInputValue] = useState('');
    const [consoleValue, setConsoleValue] = useState('');
    const [inputHistory, setInputHistory] = useState({
        array: [],
        cursor: 0
    });

    useEffect(() => {
        const socket = io({ 
            path:'/api/console/stream', 
        }); 

        socket.on('streamUpdate', (chunk) => {
            setConsoleValue((prev) => prev + chunk.data); 
            scrollToBottom();
        });
    
        return () => {
          socket.disconnect();
        };
    }, []);
    const inputRef = useRef(null);
    
    async function handleSubmit(event) {
        event.preventDefault();
        if (inputValue === '') {
            return;
        }
        setInputHistory((prev) => {
            return {
                array: [...prev.array, inputValue],
                cursor: prev.cursor + 1
            }
        });
        axios.post('/api/container/command', {
            command: inputValue
        }, {
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': localStorage.getItem('token')
            },
        }).catch((error) => {
            console.error(error);
        });

        scrollToBottom();
        setInputValue('');
    }

    function handleKeyDown(event) {
        if (event.key === 'ArrowUp') {
            if (inputHistory.cursor > 0) {
                setInputValue(inputHistory.array[inputHistory.cursor - 1]);
                setInputHistory((prev) => {
                    return {
                        array: prev.array,
                        cursor: prev.cursor - 1
                    }
                });
            }
        }
        if (event.key === 'ArrowDown') {
            if (inputHistory.array.length-1 > inputHistory.cursor) {
                setInputValue(inputHistory.array[inputHistory.cursor + 1]);
                setInputHistory((prev) => {
                    return {
                        array: prev.array,
                        cursor: prev.cursor + 1
                    }
                });
            }
        }
    }

    function scrollToBottom() {
        if (inputRef.current) {
            inputRef.current.scrollTop = inputRef.current.scrollHeight;
        }
    }

    return (
        <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{
                margin: 8,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                fontFamily: "monospace"
            }}
        >
            <TextField
                id="outlined-multiline-static"
                label="console"
                inputRef={inputRef}
                onFocus={scrollToBottom}
                multiline
                rows={16}
                fullWidth
                value={consoleValue}
                InputProps={{
                    readOnly: true,
                }}
            />
            {props.permissionToSend && <TextField
                    id="outlined-static"
                    name="console-input"
                    type="form"
                    fullWidth
                    placeholder="enter a command"
                    value={inputValue}
                    onFocus={scrollToBottom}
                    onChange={(event) => setInputValue(event.target.value)}
                    onKeyDown={handleKeyDown}
                    autoComplete='off'
                    InputProps={{
                        startAdornment: <InputAdornment position="start">{'>'}</InputAdornment>,
                    }}
                />}
        </Box>
    );
}

export default Console;