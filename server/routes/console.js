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

router.post('/command', (req, res) => {
    const command = req.body.command;

    container.exec({
        Cmd: ['mc-send-to-console', command],
    }, (err, exec) => {
        if (err) {
            console.log(err);
            res.send({ error: err });
        } else {
            exec.start();
            res.send({ message: 'command sent' });
        }
    });
});

module.exports = router;