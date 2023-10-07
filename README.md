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
- finish the rest of the pages
  - settings
  - map
- polish ui
- deploy to heroku
