const ftp = require("basic-ftp");
const express = require('express');
const fs = require('fs');
const router = express.Router();

const client = new ftp.Client();
client.ftp.verbose = true;
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
let server_properties = null;
let server_properties_expire = null;

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

router.get('/properties', async (req, res) => {
    console.log("get properties");
    if(server_properties && server_properties_expire > Date.now()) {
        console.log(`[${new Date().toISOString()}]`, '[SUCCESS] client request: sending cached server.properties');
        res.send(server_properties);
        return;
    }

    try {
        await initializeServerProperties();
        console.log(`[${new Date().toISOString()}]`, '[SUCCESS] client request: sending server.properties');
        res.send(server_properties);
    } catch (err) {
        console.error(`[${new Date().toISOString()}]`, '[ERROR] client request: failed to retrieve server.properties');
        console.error(err);
        res.send({ error: 'client request: failed to retrieve server.properties', });
    }
});

/**
 * this route allows the user to modify the server.properties file
 * 
 * process:
 * 1. read server.properties file and cache it as a string (initializeServerProperties)
 * 2. modify the string based on the request body (writeToServerProperties)
 * 3. write the string back to the server.properties file (commitServerProperties)
 */
router.post('/properties', async (req, res) => {
    let {
        level_seed,
        gamemode,
        command_block,
        level_name,
        motd,
        pvp,
        difficulty, 
        max_players,
        online_mode,
        allow_flight,
        view_distance,
        hardcore,
        white_list,
        spawn_npcs,
        spawn_animals,
        spawn_monsters,
    } = req.body;


    if(level_seed) {
        writeToServerProperties('level-seed', level_seed);
    }
    if(gamemode) {
        writeToServerProperties('gamemode', gamemode);
    }
    if(command_block) {
        writeToServerProperties('enable-command-block', command_block);
    }
    if(level_name) {
        writeToServerProperties('level-name', level_name);
    }
    if(motd) {
        writeToServerProperties('motd', motd);
    }
    if(pvp) {
        writeToServerProperties('pvp', pvp);
    }
    if(difficulty) {
        writeToServerProperties('difficulty', difficulty);
    }
    if(max_players) {
        writeToServerProperties('max-players', max_players);
    }
    if(online_mode) {
        writeToServerProperties('online-mode', online_mode);
    }
    if(allow_flight) {
        writeToServerProperties('allow-flight', allow_flight);
    }
    if(view_distance) {
        writeToServerProperties('view-distance', view_distance);
    }
    if(hardcore) {
        writeToServerProperties('hardcore', hardcore);
    }
    if(white_list) {
        writeToServerProperties('white-list', white_list);
    }
    if(spawn_npcs) {
        writeToServerProperties('spawn-npcs', spawn_npcs);
    }
    if(spawn_animals) {
        writeToServerProperties('spawn-animals', spawn_animals);
    }
    if(spawn_monsters) {
        writeToServerProperties('spawn-monsters', spawn_monsters);
    }

    try {
        await commitServerProperties();
        console.log(`[${new Date().toISOString()}]`, '[SUCCESS] client request: server.properties updated');
        res.send({ 
            success: 'client request: server.properties updated',
            server_properties: server_properties,
        });
    } catch (err) {
        console.error(`[${new Date().toISOString()}]`, '[ERROR] client request: failed to update server.properties', err);
        res.send({ error: 'client request: failed to update server.properties' });
    }
    

});

const initializeServerProperties = async () => {
    await client.downloadTo('mc/server.properties', 'mc/data/server.properties')
    server_properties = fs.readFileSync('mc/server.properties', 'utf8');
    server_properties_expire = Date.now() + 1000 * 60 * 60 * 6; // 6 hours
}

const writeToServerProperties = (key, value) => {
    console.log(key, value);
    server_properties = server_properties.replace(new RegExp(`^${key}=.*$`, 'gm'), `${key}=${value}`);
}

const commitServerProperties = () => {
    fs.writeFileSync('mc/server.properties', server_properties, 'utf8');


}

module.exports = router;