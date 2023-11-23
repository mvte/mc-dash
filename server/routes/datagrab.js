const ftp = require("basic-ftp");
const express = require('express');
const router = express.Router();

const client = new ftp.Client();
// client.ftp.verbose = true;
const settings = {
    host: process.env.FTP_HOST,
    user: process.env.FTP_USER,
    password: process.env.FTP_PASS,
    secure: true,
    secureOptions: {
        rejectUnauthorized: false
      }
};

let tree_cache = null;
let cache_expire = null;

async function buildTree(directory) {
    const tree = { 
        path: directory, 
        children: [], 
        type: ftp.FileType.Directory,
    };
    
    try {
        const list = await client.list(directory);

        for (const item of list) {
            if (item.type === ftp.FileType.Directory) {
                const subtree = await buildTree(`${directory}/${item.name}`);   
                tree.children.push(subtree);
            } else if (item.type === ftp.FileType.File) {
                tree.children.push({ 
                    name: item.name, 
                    path: `${directory}/${item.name}`,
                    type: item.type,
                });
            }
        }
    } catch (err) {
        if(err.code === 'ECONNRESET') {
            console.log(`[${new Date().toISOString()}]`, '[INFO] internal: reconnecting to ftp server...');
            await client.access(settings);
            return await buildTree(directory);
        } else {
            console.log(`[${new Date().toISOString()}]`, '[ERROR] internal: failed to build tree', err);
            throw err;
        }
    }

    if(tree.children && tree.children.length != 0) {
        tree.children.sort((a, b) => {
            if(a.type === b.type) {
                return a.name.localeCompare(b.name);
            } else {
                return a.type === ftp.FileType.Directory ? -1 : 1;
            }
        });
    }

    return {
        name: directory.split('/').pop(),
        ...tree,
    }
}

async function cacheTree() {
    client.access(settings).then(() => {
        buildTree('mc/data').then(tree => {
            tree_cache = tree;
            cache_expire = Date.now() + 1000 * 60 * 60 * 6; // 6 hours
            console.log(`[${new Date().toISOString()}]`, '[INFO] internal: tree built and cached');
        }).catch(err => {
            console.error(`[${new Date().toISOString()}]`, '[ERROR] internal: failed to build and cache tree', err);
        });
    })
}

console.log(`[${new Date().toISOString()}]`, '[INFO] internal: initializing tree cache');
cacheTree().catch(err => {
    console.log(`[${new Date().toISOString()}]`, err);
});
setInterval(() => {
    console.log(`[${new Date().toISOString()}]`, '[INFO] internal: regenerating cached tree');
    cacheTree().catch(err => {
        console.log(`[${new Date().toISOString()}]`, err);
    });
}, 1000 * 60 * 60  ); // 1 hour

router.get('/tree', async (req, res) => {
    if(tree_cache && cache_expire > Date.now()) {
        console.log(`[${new Date().toISOString()}]`, '[SUCCESS] client request: sending cached tree');
        res.send(tree_cache);
        return;
    }

    console.error(`[${new Date().toISOString()}]`, '[ERROR] client request: cache miss retrieving tree');
    res.send({ error: 'client request: cache miss retrieving tree' });
});

module.exports = router;