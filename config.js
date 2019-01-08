module.exports = {
    port: process.env.PORT || 3000,
    github: {
        token: process.env.GITHUB_TOKEN || "",
        main_org: process.env.GITHUB_MAIN || "osweekends",
        secondary_orgs: process.env.GITHUB_ORGS || ["memezinga", "Formula-UC3M", "GingerCode", "GoblinDBRocks", "OSW-Peludos"]
    }, 
    slack: {
        user: process.env.SLACK_USER || "",
        pass: process.env.SLACK_PASS || ""
    },
    twitter: {
        user: process.env.TWITTER_USER || "os_weekends"
    }
};