const ftp = require("basic-ftp");
const express = require('express');
const fs = require('fs');
const router = express.Router();
const OpQueue = require('../utils/opqueue');

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
const opq = new OpQueue();

/* ============================FILE TREE============================ */
let tree_cache = null;
let cache_expire = null;

async function buildTree(client, directory) {
    const tree = { 
        path: directory, 
        children: [], 
        type: ftp.FileType.Directory,
    };
    
    try {
        const list = await client.list(directory);

        for (const item of list) {
            if (item.type === ftp.FileType.Directory) {
                const subtree = await buildTree(client, `${directory}/${item.name}`);   
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
            return await buildTree(client, directory);
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
    const client = new ftp.Client();
    return client.access(settings).then(() => {
        return buildTree(client, 'mc/data').then((tree) => {
            tree_cache = tree;
            cache_expire = Date.now() + 1000 * 60 * 60 * 6; // 6 hours
            console.log(`[${new Date().toISOString()}]`, '[INFO] internal: tree built and cached');
        }).catch(err => {
            console.error(`[${new Date().toISOString()}]`, '[ERROR] internal: failed to build and cache tree', err);
        }).finally(() => {
            client.close();
        });
    })
}

console.log(`[${new Date().toISOString()}]`, '[INFO] internal: initializing tree cache');
opq.add(cacheTree).catch(err => {
    console.log(`[${new Date().toISOString()}]`, err);
});
setInterval(() => {
    console.log(`[${new Date().toISOString()}]`, '[INFO] internal: regenerating cached tree');
    opq.add(cacheTree).catch(err => {
        console.log(`[${new Date().toISOString()}]`, err);
    });
}, 1000 * 60 * 60  ); // 1 hour

router.get('/tree', async (req, res) => {
    if(tree_cache && cache_expire > Date.now()) {
        console.log(`[${new Date().toISOString()}]`, '[SUCCESS] client request: sending cached tree');
        res.send(tree_cache);
        return;
    }

    console.error(`[${new Date().toISOString()}]`, '[ERROR] internal: cache miss retrieving tree, attempting to rebuild');
    try {
        await opq.add(cacheTree);
        console.log(`[${new Date().toISOString()}]`, '[SUCCESS] client request: sending rebuilt tree');
        res.send(tree_cache);
        return;
    } catch (error) {
        res.status(500).send({ error: 'client request: failed to retrieve tree', });
        console.log(`[${new Date().toISOString()}]`, '[ERROR] client request: failed to retrieve tree', error);
    }
});


/* ============================SERVER PROPERTIES============================ */
const ALLOWED_PROPERTIES = [
    "level-seed",
    "gamemode",
    "enable-command-block",
    "level-name",
    "pvp",
    "difficulty", 
    "max-players",
    "online-mode",
    "allow-flight",
    "view-distance",
    "hardcore",
    "white-list",
    "spawn-npcs",
    "spawn-animals",
    "spawn-monsters",
];
const ALLOWED_VALUES = {
    "gamemode": ["survival", "creative", "adventure", "spectator"],
    "pvp": ["true", "false"],
    "difficulty": ["peaceful", "easy", "normal", "hard"],
    "online-mode": ["true", "false"],
    "allow-flight": ["true", "false"],
    "hardcore": ["true", "false"],
    "white-list": ["true", "false"],
    "spawn-npcs": ["true", "false"],
    "spawn-animals": ["true", "false"],
    "spawn-monsters": ["true", "false"],
    "enable-command-block": ["true", "false"],
};
let server_properties = {};
let server_properties_expire = null;

/* PROPERTIES AND IDENTITY SECTION(S) */

/**
 * this route serves the server properties
 * the request body should include some parameters:
 * {
 *  allowedOnly: boolean, // whether to return only the allowed properties
 *  properties: string, // the properties to return, comma separated
 * }
 * note, if plain text is requested, the allowedOnly parameter is ignored
 * similarly, if allowedOnly is true, the properties parameter is ignored
 */
router.get('/properties', async (req, res) => {
    const asPlainText = req.headers['content-type'] === 'text/plain';
    const allowedOnly = req.query.allowedOnly;
    const requestedProperties = req.query.properties;

    try {
        if(!server_properties || server_properties_expire < Date.now()) {
            await opq.add(initializeServerProperties);
        }

        if(asPlainText) {
            console.log(`[${new Date().toISOString()}]`, '[SUCCESS] client request: sending server.properties as plain text');
            res.send(server_properties.text);
            return;
        }

        if(allowedOnly) {
            console.log(`[${new Date().toISOString()}]`, '[SUCCESS] client request: sending allowed properties');
            res.send(server_properties.list.filter(property => ALLOWED_PROPERTIES.includes(property.name)));
            return;
        }
        
        if(requestedProperties) {
            const properties = requestedProperties.split(',');
            console.log(`[${new Date().toISOString()}]`, '[SUCCESS] client request: sending requested properties');
            res.send(server_properties.list.filter(property => properties.includes(property.name)));
            return;
        }

        console.log(`[${new Date().toISOString()}]`, '[SUCCESS] client request: sending server.properties');
        res.send(server_properties.list);
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
 * 1. read server.properties file and cache it as a string and json (initializeServerProperties)
 * 2. modify the string based on the request body (writeToServerProperties)
 * 3. write the string back to the server.properties file (commitServerProperties)
 */
router.post('/properties', async (req, res) => {
    if(!server_properties || server_properties_expire < Date.now()) {
        try {
            opq.add(initializeServerProperties);
        } catch (err) {
            console.error(`[${new Date().toISOString()}]`, '[ERROR] client request: failed to retrieve server.properties');
            console.error(err);
            res.send({ error: 'client request: failed to retrieve server.properties', });
            return;
        }
    }
    
    for(const [key, value] of Object.entries(req.body)) {
        writeToServerProperties(key, value);
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

// reads server.properties file and caches it as a list of objects
const initializeServerProperties = async () => {
    const client = new ftp.Client();

    return client.access(settings)
        .then(() => client.downloadTo('mc/server.properties', 'mc/data/server.properties'))
        .then(() => {
            server_properties.text = fs.readFileSync('mc/server.properties', 'utf8');
            server_properties.list = server_properties.text
                .split('\n')
                .map((line) => {
                    const [name, value] = line.split('=');
                    return { name, value, options: ALLOWED_VALUES[name] };
                });

            server_properties_expire = Date.now() + 1000 * 60 * 60 * 6; // 6 hours
        })
        .finally(() => {
            client.close();
        });
}

const writeToServerProperties = (key, value) => {
    console.log(key, value);
    server_properties.text = server_properties.text.replace(new RegExp(`^${key}=.*$`, 'gm'), `${key}=${value}`);
    server_properties.list = server_properties.list.map((property) => {
        if(property.name === key) {
            return { ...property, value };
        } else {
            return property;
        }
    });
}

const commitServerProperties = () => {
    fs.writeFileSync('mc/server.properties', server_properties.text, 'utf8');
}

/* VERSION SECTION */

// this should probably be automated
const SERVER_TYPE_COMPATIBILITY = {
    vanilla: ['1.20', '1.20.1', '1.20.2', '1.20.3', '1.20.4'],
    paper: ['1.20', '1.20.1', '1.20.2', '1.20.4'],
    bukkit: ['1.20.1', '1.20.2', '1.20.4'],
    spigot: ['1.20.1', '1.20.2', '1.20.4'],
    forge: ['1.20', '1.20.1', '1.20.2', '1.20.3', '1.20.4'],
    fabric: ['1.20', '1.20.1', '1.20.2', '1.20.3', '1.20.4'],
};
let server = null;
let server_expire = null;

// this route serves the version and type
router.get('/version', async (req, res) => {
    if(!server || server_expire < Date.now()) {
        try {
            await opq.add(initializeServer);
        } catch (err) {
            console.error(`[${new Date().toISOString()}]`, '[ERROR] client request: failed to retrieve docker-compose file');
            console.error(err);
            res.send({ error: 'client request: failed to retrieve server.properties', });
            return;
        }
    }
    
    console.log(`[${new Date().toISOString()}]`, '[SUCCESS] client request: sending server version and type');
    res.send(server);
});

const initializeServer = async () => {
    const client = new ftp.Client();
    await client.access(settings);
    
    await client.downloadTo('mc/docker-compose.yml', 'mc/docker-compose.yml');
    const compose = fs.readFileSync('mc/docker-compose.yml', 'utf8');

    const lines = compose.split('\n');
    const version = lines.find(line => line.includes('VERSION:')).split(':')[1].trim();
    const type = lines.find(line => line.includes('TYPE:')).split(':')[1].trim();

    server = { version, type };
    server_expire = Date.now() + 1000 * 60 * 60 * 6; // 6 hours

    client.close();
}

router.get('/version/compatibility', async (req, res) => {
    res.send(SERVER_TYPE_COMPATIBILITY);
});

module.exports = router;