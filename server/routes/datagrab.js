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
    const tree = { name: directory, children: [] };
    
    try {
        const list = await client.list(directory);

        for (const item of list) {
            if (item.type === ftp.FileType.Directory) {
                const subtree = await buildTree(`${directory}/${item.name}`);   
                tree.children.push(subtree);
            } else if (item.type === ftp.FileType.File) {
                tree.children.push({ name: item.name });
            }
        }
    } catch (err) {
        console.log(err);
        if(err.code === 'ECONNRESET') {
            console.log('reconnecting...');
            await client.access(settings);
            return await buildTree(directory);
        } else {
            throw err;
        }
    }

    return tree;
}

router.get('/tree', async (req, res) => {
    if(tree_cache && cache_expire > Date.now()) {
        console.log('sending cached tree');
        res.send(tree_cache);
        return;
    }

    console.log('building tree')
    try {
        client.access(settings).then(() => {
            buildTree('mc/data').then(tree => {
                tree_cache = tree;
                cache_expire = Date.now() + 1000 * 60 * 60 * 24; // 24 hours
                res.send(tree);
            }).catch(err => {
                console.log(err);
                res.send({
                    error: err,
                });
            });
        }).catch(err => {
            console.log(err);
            res.send({ error: err });
        });
    } catch (err) {
        console.log(err);
        res.send({ error: err });
    }
});

module.exports = router;