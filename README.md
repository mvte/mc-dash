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
4. see website at http://localhost:9000. note that this port serves the production build. your development environment (on port 3000) will still be able to communicate with this server's api.

## plans
- login 
- figure out docker api to see resource usage
- maybe make our own api to see server stats
