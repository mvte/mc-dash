//this component shows u how to get information from the backend to display on the front end
import React, { useState, useEffect } from "react";
import axios from "axios"; //axios is a library that allows you to make requests to the backend

function StatusTest() {
    const [players, setPlayers] = useState("loading...");
    const [uptime, setUptime] = useState("loading...");

    const [stats, setStats] = useState({
        memoryUsage: "loading...",
        cpuUsage: "loading...",
        memoryLimit: "loading..."
    }); //this is an example of how you can store multiple variables in one state variable

    /*
        the use effect hook is used to run code when the component is "mounted", or first rendered
        the empty array as the second argument means that the code will only run oncezzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzSDddddddddddddddd
        if you want the code to run when a certain variable changes, put that variable in the array

    */
    useEffect(() => {
        const updatePlayers = async () => {
          await axios.get("api/info/status") //this route gets the server status
            .then(res => {
                setPlayers(res.data.players.online);
            })
            .catch(err => {
                console.log(err);
            });
        }
        updatePlayers();

        const updateStats = async () => {
            await axios.get("api/performance/stats") //this route gets current memory usage, cpu usage, and memory limit (around 16gb)
                .then(res => {
                    setStats(res.data);
                })
                .catch(err => {
                    console.log(err);
                });
        }
        updateStats();

        const updateUptime = async () => {
            await axios.get("api/performance/uptime") //this route gets the server uptime in milliseconds
                .then(res => {
                    setUptime(res.data.uptime);
                })
                .catch(err => {
                    console.log(err);
                });
        }
        updateUptime();
      }, []);

    const { memoryUsage, cpuUsage, memoryLimit } = stats; //destructuring

    return (
        <div>
            <p>
                players online: {players}
            </p>
            <p>
                memory usage: {memoryUsage}%
            </p>
            <p>
                memory limit: {memoryLimit} (in bytes)
            </p>
            <p>
                cpu usage: {cpuUsage}%
            </p>
            <p>
                uptime: {uptime} (in milliseconds)
            </p>
        </div>  
    );
}

export default StatusTest;