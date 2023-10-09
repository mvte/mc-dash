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
        console.log(err);
        if(err.code === 'ECONNRESET') {
            console.log('internal: reconnecting...');
            await client.access(settings);
            return await buildTree(directory);
        } else {
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
            console.log('internal: tree built and cached');
        }).catch(err => {
            console.log(err);
        });
    })
}

console.log("internal: initializing tree cache");
cacheTree().catch(err => {
    console.log(err);
});
setInterval(() => {
    console.log("internal: regenerating cached tree");
    cacheTree().catch(err => {
        console.log(err);
    });
}, 1000 * 60 * 60  ); // 1 hour

router.get('/tree', async (req, res) => {
    if(tree_cache && cache_expire > Date.now()) {
        console.log('[SUCCESS] client request: sending cached tree');
        res.send(tree_cache);
        return;
    }

    console.log('[ERROR] client request: cache miss retrieving tree');
    res.send({ error: 'client request: cache miss retrieving tree' });
});

module.exports = router;