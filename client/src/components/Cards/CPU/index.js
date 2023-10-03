import { TallCard } from "../CardConsts";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
  } from 'chart.js';
import { Line } from "react-chartjs-2";
import { useState, useEffect } from "react";
import io from "socket.io-client";

const CPU = (props) => {
    const [cpuData, setCpuData] = useState({
        labels: ["0s"],
        datasets: [
            {
                label: "cpu usage (%)",
                data: [],
                backgroundColor: "#8CC9E7",
                borderColor: "#8CC9E7",
            },
        ],
    });

    ChartJS.register(
        CategoryScale,
        LinearScale,
        PointElement,
        LineElement,
        Title,
        Tooltip,
    );

    const options = {
        scales: {
            y: {
                beginAtZero: true,
            },
        },
        elements: {
            point: {
                radius: 0,
            },
        }
    };

    useEffect(() => {
        console.log('connecting to socket');
        let timeStart = Date.now();
        const socket = io({ //this is how you connect to the data stream
          path:'/api/performance/stream', //this path is necessary to connect to the stream
        }); 
    
        socket.on('streamUpdate', (data) => { //this socket is listening for a streamUpdate event, which i have defined in the backend
            setCpuData((prev) => {
                let intervalLabel = "";
                if(Date.now() - timeStart > 1000 * 10) {
                    const timeSince = Math.floor((Date.now() - timeStart) / 1000);
                    const timeMod = timeSince % 10;
                    intervalLabel = timeMod < 1 ? (timeSince - timeMod) + "s" : "";
                }

                return {
                    labels: [...prev.labels, intervalLabel],
                    datasets: [
                        {
                            ...prev.datasets[0],
                            data: [...prev.datasets[0].data, data.cpuUsage],
                        },
                    ],
                }
          });  //when the event is received, the data is set to the state variable   
        });

    
        return () => {
          socket.disconnect(); //when the component is unmounted, the socket is disconnected
        };
    }, []);

    return <>
        <TallCard>
            <b>
            cpu usage:
            </b>
            <Line options={options} data={cpuData} />
        </TallCard>
    </>
}

export default CPU;