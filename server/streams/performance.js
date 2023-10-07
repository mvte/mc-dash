const Docker = require('dockerode');
const fs = require('fs');

const docker = new Docker({
    protocol: 'https',
    host: process.env.DOCKER_HOST,
    port: 2376,
    ca: fs.readFileSync('certs/ca.pem'),
    cert: fs.readFileSync('certs/cert.pem'),
    key: fs.readFileSync('certs/key.pem')
});

let container = docker.getContainer(process.env.CONTAINER_ID);

module.exports = function (io) {
    io.on('connection', (socket) => {
        console.log('client connected to performance stream');

        container.stats({ stream: true }, (err, stream) => {
            if (err) {
                console.log(err);
            } else {
                stream.on('data', (chunk) => {
                    const data = JSON.parse(chunk.toString());
                    const usedMemory = data.memory_stats.usage;
                    const memUsageAsPercentage = (usedMemory / data.memory_stats.limit) * 100;

                    //calc cpu usage
                    const cpuDelta = data.cpu_stats.cpu_usage.total_usage - data.precpu_stats.cpu_usage.total_usage;
                    const systemDelta = data.cpu_stats.system_cpu_usage - data.precpu_stats.system_cpu_usage;
                    const cpuUsageAsPercentage = (cpuDelta / systemDelta) * data.cpu_stats.online_cpus * 100;

                    socket.emit('streamUpdate', {
                        memoryUsage: memUsageAsPercentage,
                        cpuUsage: cpuUsageAsPercentage,
                        memoryUsed: usedMemory,
                    });
                });

                stream.on('error', () => {
                    console.log('error');
                });

                stream.on('disconnect', () => {
                    console.log('stream ended');
                    stream.destroy();
                });
            }
        });

        socket.on('disconnect', () => {
            console.log('client disconnected');
        });
    });
}