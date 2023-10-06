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

const Memory = (props) => {
    const [memData, setMemData] = useState({
        labels: ["0s"],
        datasets: [
            {
                label: "memory usage (%)",
                data: [],
                backgroundColor: "#714F7E",
                borderColor: "#714F7E",
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
                max: 100,
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
            setMemData((prev) => {
                let intervalLabel = "";
                if(Date.now() - timeStart > 1000 * 10) {
                    const timeSince = Math.floor((Date.now() - timeStart) / 1000);
                    const timeMod = timeSince % 10;
                    intervalLabel = timeMod < 1 ? (timeSince - timeMod) + "s" : "";
                }
                
                let newLabels = [...prev.labels, intervalLabel];
                let newData = [...prev.datasets[0].data, data.memoryUsage];
                if(prev.datasets[0].data.length > 60) {
                    newLabels = newLabels.slice(1);
                    newData = newData.slice(1);
                }

                return {
                    labels: newLabels,
                    datasets: [
                        {
                            ...prev.datasets[0],
                            data: newData,
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
            memory usage:
            </b>
            <Line options={options} data={memData} />
        </TallCard>
    </>
}

export default Memory;