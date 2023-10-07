const express = require('express');
const router = express.Router();
const Docker = require('dockerode');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');
const { admin, user } = require('../middleware/roles');

const docker = new Docker({
    protocol: 'https',
    host: process.env.DOCKER_HOST,
    port: 2376,
    ca: fs.readFileSync('certs/ca.pem'),
    cert: fs.readFileSync('certs/cert.pem'),
    key: fs.readFileSync('certs/key.pem')
});

let container = docker.getContainer(process.env.CONTAINER_ID);

router.post('/command', [auth, admin], (req, res) => {
    const command = req.body.command;

    container.exec({
        Cmd: ['mc-send-to-console', command],
    }, (err, exec) => {
        if (err) {
            console.log(err);
            res.send({ error: err });
        } else {
            exec.start();
            res.status(200).send({ 
                ok: true,
                message: 'command sent' });
        }
    });
});

router.post('/start', [auth, admin], (req, res) => {
    container.start((err, data) => {
        if (err) {
            console.log(err);
            res.send({ error: err });
        } else {
            res.status(200).send({
                ok: true,
                message: 'server started'
            });
        }
    });
});

router.post('/stop', [auth, admin], (req, res) => {
    container.stop((err, data) => {
        if (err) {
            console.log(err);
            res.send({ error: err });
        } else {
            res.status(200).send({
                ok: true,
                message: 'server stopped'
            });
        }
    });
});

router.post('/restart', [auth, admin], (req, res) => {
    container.restart((err, data) => {
        if (err) {
            console.log(err);
            res.send({ error: err });
        } else {
            res.status(200).send({
                ok: true,
                message: 'server restarted'
            });
        }
    });
});

router.get('/health', (req, res) => {
    container.inspect((err, data) => {
        if (err) {
            console.log(err);
            res.send({ error: err });
        } else {
            res.status(200).send({
                ok: true,
                health: data.State.Status,
            });
        }
    });
});

module.exports = router;