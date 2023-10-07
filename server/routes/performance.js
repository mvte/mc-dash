/*
this route provieds performance information about the server
including
- memory usage
- cpu usage
- uptime
- memory usage as stream
- cpu usage as stream
*/
const express = require('express');
const router = express.Router();
const Docker = require('dockerode');
const fs = require('fs');
const path = require('path');

const docker = new Docker({
    protocol: 'https',
    host: process.env.DOCKER_HOST,
    port: 2376,
    ca: fs.readFileSync(path.resolve(__dirname, '..', '..', 'certs', 'ca.pem')),
    cert: fs.readFileSync(path.resolve(__dirname, '..', '..', 'certs', 'cert.pem')),
    key: fs.readFileSync(path.resolve(__dirname, '..', '..', 'certs', 'key.pem'))
});

let container = docker.getContainer(process.env.CONTAINER_ID);

router.get('/stats', (req, res) => {
    container.stats({ stream: false }, (err, data) => {
        if (err) {
            res.send({ error: err });
        } else {
            //calc memory usage
            const usedMemory = data.memory_stats.usage;
            const memUsageAsPercentage = (usedMemory / data.memory_stats.limit) * 100;

            //calc cpu usage
            const cpuDelta = data.cpu_stats.cpu_usage.total_usage - data.precpu_stats.cpu_usage.total_usage;
            const systemDelta = data.cpu_stats.system_cpu_usage - data.precpu_stats.system_cpu_usage;
            const cpuUsageAsPercentage = (cpuDelta / systemDelta) * data.cpu_stats.online_cpus * 100;

            res.send({
                memoryUsage: memUsageAsPercentage,
                cpuUsage: cpuUsageAsPercentage,
                memoryLimit: data.memory_stats.limit,
            });
        }
    });
});

router.get('/uptime', (req, res) => {
    container.inspect((err, data) => {
        if (err) {
            res.send({ error: err });
        } else {
            if(data.State.Status !== "running") {
                res.send({ uptime: 0 });
            } else {
                const uptime = new Date() - new Date(data.State.StartedAt);
                res.send({ uptime: uptime });
            }
        }
    });
});


module.exports = router;