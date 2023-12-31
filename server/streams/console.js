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

module.exports = function (io) {
    io.on('connection', (socket) => {
        console.log(`[${new Date().toISOString()}]`, '[SUCCESS] client connected to logs stream');

        container.logs({ follow: true, stdout: true, stderr: true }, (err, stream) => {
            if (err) {
                console.log(`[${new Date().toISOString()}]`, err);
            } else {
                stream.on('data', (chunk) => {
                    const data = chunk.toString();
                    socket.emit('streamUpdate', {
                        data: data,
                    });
                });
                
                stream.on('error', () => {
                    console.error(`[${new Date().toISOString()}]`, '[ERROR] something went wrong in the logs stream');
                });

                stream.on('disconnect', () => {
                    console.log(`[${new Date().toISOString()}]`, '[INFO] logs stream ended');
                    stream.destroy();
                });
            }
        });

        socket.on('disconnect', () => {
            console.log(`[${new Date().toISOString()}]`, '[INFO] client disconnected');
        });
    });
}
