//this component shows you how to access the performance stream from the backend
import { useState, useEffect } from "react";
import socketIOClient from "socket.io-client"; //this is the library that allows us to connect to the socket

const GraphTest = (props) => {
    const [data, setData] = useState("loading..."); //the useState hook allows us to re-render only specific components when a variable changes

    useEffect(() => {
        console.log('connecting to socket');
        const socket = socketIOClient('http://localhost:9001'); //note that the port is 9001, not 9000
    
        socket.on('streamUpdate', (data) => { //this socket is listening for a streamUpdate event, which i have defined in the backend
          setData(data);  //when the event is received, the data is set to the state variable   
        });
    
        return () => {
          socket.disconnect(); //when the component is unmounted, the socket is disconnected
        };
    }, []);

    const {memoryUsage, cpuUsage, memoryUsed} = data; //currently, the data is an object with the following properties: memoryUsage, cpuUsage, memoryUsed
    return <>
      streamed data: {JSON.stringify(data)}
      <ul>
        <li>memory usage: {memoryUsage}</li>
        <li>cpu usage: {cpuUsage}</li>
        <li>memoryUsed: {memoryUsed}</li>
      </ul>
    </>
}

export default GraphTest;