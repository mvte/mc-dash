const express = require('express');
const router = express.Router();
const Docker = require('dockerode');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');
const { admin, user } = require('../middleware/roles');
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

router.post('/command', [auth, admin], (req, res) => {
    console.log(`[${new Date().toISOString()}]`, '[INFO] received request for /command:', req.body.command);
    const command = req.body.command;

    container.exec({
        Cmd: ['mc-send-to-console', command],
    }, (err, exec) => {
        if (err) {
            console.error(`[${new Date().toISOString()}]`, "[ERROR] could not create exec instance", err);
            res.send({ error: err });
        } else {
            exec.start();
            console.log(`[${new Date().toISOString()}]`, "[SUCCESS] command sent and executed");
            res.status(200).send({ 
                ok: true,
                message: 'command sent' });
        }
    });
});

router.post('/start', [auth, admin], (req, res) => {
    console.log(`[${new Date().toISOString()}]`, '[INFO] received request for /start');
    container.start((err, data) => {
        if (err) {
            console.error(`[${new Date().toISOString()}]`, "[ERROR] could not start container", err);
            res.send({ error: err });
        } else {
            console.log(`[${new Date().toISOString()}]`, "[SUCCESS] container started");
            res.status(200).send({
                ok: true,
                message: 'server started'
            });
        }
    });
});

router.post('/stop', [auth, admin], (req, res) => {
    console.log(`[${new Date().toISOString()}]`, '[INFO] received request for /stop');
    container.stop((err, data) => {
        if (err) {
            console.error(`[${new Date().toISOString()}]`, "[ERROR] could not stop container", err);
            res.send({ error: err });
        } else {
            console.log(`[${new Date().toISOString()}]`, "[SUCCESS] container stopped");
            res.status(200).send({
                ok: true,
                message: 'server stopped'
            });
        }
    });
});

router.post('/restart', [auth, admin], (req, res) => {
    console.log(`[${new Date().toISOString()}]`, '[INFO] received request for /restart');
    container.restart((err, data) => {
        if (err) {
            console.error(`[${new Date().toISOString()}]`, "[ERROR] could not restart container", err);
            res.send({ error: err });
        } else {
            console.log(`[${new Date().toISOString()}]`, "[SUCCESS] container restarted");
            res.status(200).send({
                ok: true,
                message: 'server restarted'
            });
        }
    });
});

router.get('/health', (req, res) => {
    console.log(`[${new Date().toISOString()}]`, '[INFO] received request for /health');
    container.inspect((err, data) => {
        if (err) {
            console.error(`[${new Date().toISOString()}]`, "[ERROR] could not inspect container health", err);
            res.send({ error: err });
        } else {
            console.log(`[${new Date().toISOString()}]`, "[SUCCESS] container health retrieved and sent");
            res.status(200).send({
                ok: true,
                health: data.State.Status,
            });
        }
    });
});

module.exports = router;