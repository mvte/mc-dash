/**
 * @class OpQueue
 * @description A queue of operations to be performed sequentially. Particularly useful for FTP operations, which doesn't allow concurrent operations.
 */
class OpQueue {
    constructor() {
        this.queue = [];
        this.active = false;
    }

    add(op) {
        console.log(`[${new Date().toISOString()}]`, `[INFO] internal: added operation to queue`);
        return new Promise((resolve, reject) => {
            this.queue.push({
                op,
                resolve,
                reject,
            });
            this.next();
        })
    }

    next() {
        if(this.queue.length > 0 && !this.active) {
            this.active = true;
            const {op, resolve, reject } = this.queue.shift();
            
            op()
                .then((result) => {
                    console.log(`[${new Date().toISOString()}]`, `[INFO] internal: queue completed operation successfully`);
                    this.active = false;
                    resolve(result)
                    this.next();
                })
                .catch((err) => {
                    console.error(`[${new Date().toISOString()}]`, `[ERROR] internal: operation queue hit an error`, err)
                    this.active = false;
                    reject(err);
                    this.next();
                })
        }
    }
}

module.exports = OpQueue;