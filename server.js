const project = require('pillars');
const config = require("./config");


// Starting the project
project.services.get('http').configure({
    port: config.port
}).start();


const apiRoutes = new Route({
    id: 'apiRoutes',
    path: 'api/v1/*:path',
    cors: true,
    method: "GET"
}, function(gw) {
    console.log("Hello from the API!")
    gw.json(500);
});

const rootRoutes = new Route({
    id: 'rootRoutes',
    path: '/*',
    cors: true,
    method: "GET",
    directory: {
        path: './public/index.html',
        listing: true
    }
});

const staticFiles = new Route({
    id: 'estatics',
    path: '/*:path',
    directory: {
        path: './public',
        listing: true
    }
});

// Routes addition
project.routes.add(apiRoutes);
project.routes.add(rootRoutes);
project.routes.add(staticFiles);
