import React, { useState, useEffect } from "react";
import axios from "axios";

function Status() {
    const [players, setPlayers] = useState("loading...");
    const [memoryUsage, setMemoryUsage] = useState("loading...");
    const [cpuUsage, setCpuUsage] = useState("loading...");

    useEffect(() => {
        const updatePlayers = async () => {
          await axios.get("api/info/status")
            .then(res => {
              setPlayers(res.data.players.online);
            })
            .catch(err => {
              console.log(err);
            });
        }
        updatePlayers();

        const updateMemoryUsage = async () => {
            await axios.get("api/performance/memory_usage")
                .then(res => {
                    setMemoryUsage(res.data.memory_usage.toFixed(2) + "%");
                })
                .catch(err => {
                    console.log(err);
                });
        }
        updateMemoryUsage();

        const updateCpuUsage = async () => {
            await axios.get("api/performance/cpu_usage")
                .then(res => {
                    setCpuUsage(res.data.cpu_usage.toFixed(2) + "%");
                })
                .catch(err => {
                    console.log(err);
                });
        }
        updateCpuUsage();
      }, []);

    return (
        <div>
            <p>
                players online: {players}
            </p>
            <p>
                memory usage: {memoryUsage}
            </p>
            <p>
                cpu usage: {cpuUsage}
            </p>
        </div>  
    );
}

export default Status;