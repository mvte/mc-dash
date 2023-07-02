# mc-dash
dashboard for play.mvte.net

## setup
make sure you are on node 16

### frontend
1. open terminal in `client/`
2. run `npm i` to install dependencies
3. then run `npm start`
4. see website at http://localhost:3000

### backend
1. open terminal in `server/`
2. run `npm i` to install dependencies
3. run `node server.js`
4. see website at http://localhost:9000.

note that this port serves the production build, and requires that `npm run build` has been run at least once in the client directory. your development environment (on port 3000) will still be able to communicate with this server's api.

### secret files
`.env` goes into the `server/` directory, and `certs/` goes into the root

## plans
### frontend
- sidebar components
  - dashboard
  - settings
  - console
  - map
  - backups
  - sign out
- top nav bar
  - username in corner
  - on click should show drop down with options (user role, and sign out button)
- dashboard
  - hello card (this should be wide)
    - "hello [username], welcome back to your dashboard \n [server_ip]
    - something like that
  - start/stop/restart card (admin only)
  - status card
    - server is up or down 
    - container health
  - server info
    - name
    - message of the day
    - address
    - version
  - list of players online
  - cpu usage graph
  - memory graph (in gb)
  - installed plugins/mods
  - used mui to create bento box layout
- console
  - disable the enter command textfield for users

### backend
- admins should be able to make changes to the settings
    - figure out how to use ftp
    - set up user on remote machine that has access to only that folder
- promotion keys
    - generate a key that can be used to promote a user to admin
    - post request requires multiple things:
        - super secret admin password (.env)
        - username to be promoted
    - behind the scenes, a key is generated and stored in a database
        - the key is a random string of characters
        - the key is associated with the username
    - if the user is already an admin, or the super secret admin password is incorrect, then a key is not generated
    - otherwise, a key is generated and delivered in the response
    - the user can then use the key to promote themselves to admin through the dashboard
    - alternatively, the user can message me and i will promote them to admin manually
- backups
    - i have no idea where to start with this LOL
