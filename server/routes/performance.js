/*
this route provieds performance information about the server
including
- memory usage
- cpu usage
- uptime

*/
const express = require('express');
const router = express.Router();
const Docker = require('dockerode');
const fs = require('fs');

const docker = new Docker({
    protocol: 'https',
    host: process.env.DOCKER_HOST,
    port: 2376,
    ca: fs.readFileSync('../certs/ca.pem'),
    cert: fs.readFileSync('../certs/cert.pem'),
    key: fs.readFileSync('../certs/key.pem')
});

let container = docker.getContainer(process.env.CONTAINER_ID);


router.get('/memory_usage', (req, res) => {
    container.stats({ stream: false }, (err, data) => {
        if (err) {
            res.send({ error: err });
        } else {
            console.log(data.memory_stats);
            const usedMemory = data.memory_stats.usage;
            const usageAsPercentage = (usedMemory / data.memory_stats.limit) * 100;
            console.log(usageAsPercentage);
            res.send({ memory_usage: usageAsPercentage });
        }
    });
});

router.get('/cpu_usage', (req, res) => {
    container.stats({ stream: false }, (err, data) => {
        if (err) {
            res.send({ error: err });
        } else {
            const cpuDelta = data.cpu_stats.cpu_usage.total_usage - data.precpu_stats.cpu_usage.total_usage;
            const systemDelta = data.cpu_stats.system_cpu_usage - data.precpu_stats.system_cpu_usage;
            const usageAsPercentage = (cpuDelta / systemDelta) * data.cpu_stats.online_cpus * 100;
            console.log(usageAsPercentage);
            res.send({ cpu_usage: usageAsPercentage });
        }
    });
});


module.exports = router;