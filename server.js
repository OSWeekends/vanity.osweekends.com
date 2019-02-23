const project = require('pillars');
const GDB = require("@goblindb/goblindb");
const Scheduled = require("scheduled");
const config = require("./config");
const apiManagement = require('./api');
const twitter_task = require("./scheduled_tasks/twitter");
const meetup_task = require("./scheduled_tasks/meetup");
const slack_task = require("./scheduled_tasks/slack");
const github_task = require("./scheduled_tasks/github");
const organziation_task = require("./scheduled_tasks/organization");

// Wake up GoblinDB
const goblinDB = GDB({
    fileName: 'goblin'
    }, err => {
        if(err) throw "GoblinDB ERROR:", err;
        // Starting the project
        project.services.get('http').configure({
            port: config.port
        }).start();
});

// Routes definition
const apiRoutes = new Route({
    id: 'apiRoutes',
    path: 'api/v1/*:path',
    cors: true,
    method: "GET"
}, function(gw) {
    apiManagement(gw, goblinDB);
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


// Cron Jobs definition
const dailyTasks = new Scheduled({
    id: "dailyTasks",
    pattern: "0 9 * * * *", // 09:00 AM every day
    task: () => {
        slack_task.slackInfo(goblinDB);
        twitter_task.twitterInfo(goblinDB);
        meetup_task.meetupInfo(goblinDB);
    }
});

const hourlyTask = new Scheduled({
    id: "hourlyTask",
    pattern: "0 * * * * *", // Every Hour
    task: () => {
        github_task.allData(goblinDB);
        organziation_task.communities(goblinDB);
        organziation_task.team(goblinDB);
        organziation_task.sponsors(goblinDB);
    }
});

// -- Start Jobs
dailyTasks.start();
hourlyTask.start();

// -- Autostart Jobs
dailyTasks.launch();
hourlyTask.launch();
