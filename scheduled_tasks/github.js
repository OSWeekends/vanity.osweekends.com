const octokit = require('@octokit/rest')();
const config = require("../config");

const githubToken = config.github.token;
const githubMainOrg = config.github.main_org;
const githubOrgs = config.github.secondary_orgs.slice();
githubOrgs.push(githubMainOrg);

octokit.authenticate({
    type: 'token',
    token: githubToken
});

async function paginate(method, settings = {}) {
    let response = await method(settings);
    let {
        data
    } = response;
    while (octokit.hasNextPage(response)) {
        response = await octokit.getNextPage(response);
        data = data.concat(response.data);
    }
    return data;
}

function sortByDate(a, b) {
    if (a.created_at < b.created_at)
        return 1;
    if (a.created_at > b.created_at)
        return -1;
    return 0;
}

function getOrgPublicActivity(org, per_page = 100) {
    return new Promise((resolve, reject) => {
        octokit.activity.getEventsForOrg({org, per_page})
            .then(data => {
                resolve(data.data.map(item => {
                    if(item.payload) {
                        delete item.payload;
                    }
                    return item;
                }));
            })
            .catch(reject);
    });
}

function getAllOrgPublicActivity(items_per_org = 10) {
    console.log("[GitHub API][PUBLIC ACTIVITY] started...");
    return new Promise((resolve, reject) => {
        const repositories = githubOrgs.map(org => getOrgPublicActivity(org, items_per_org));
        Promise.all(repositories)
            .then(response => {
                const allData = response
                    .reduce((a, b) => a.concat(b))
                    .sort(sortByDate);
                resolve(allData);
                console.log("[GitHub API][PUBLIC ACTIVITY] done");
            })
            .catch(reject);
    });
}

function getOrgPublicRepos(org) {
    return new Promise((resolve, reject) => {
        paginate(octokit.repos.getForOrg, {
                per_page: 100,
                org: org,
                type: 'public'
            })
            .then(data => {
                const cleanData = data.map(item => {
                    return {
                        description: item.description,
                        pushed_at: item.pushed_at,
                        updated_at: item.updated_at,
                        created_at: item.created_at,
                        forks_count: item.forks_count,
                        open_issues_count: item.open_issues_count,
                        watchers_count: item.watchers_count,
                        stargazers_count: item.stargazers_count,
                        has_issues: item.has_issues,
                        has_projects: item.has_projects,
                        has_downloads: item.has_downloads,
                        has_wiki: item.has_wiki,
                        has_pages: item.has_pages,
                        language: item.language,
                        url: item.html_url,
                        org: item.owner.login,
                        org_avatar: item.owner.avatar_url,
                        repo: item.full_name
                    };
                });
                resolve(cleanData);
            })
            .catch(reject);
    });

}

function getAllOrgPublicRepos() {
    console.log("[GitHub API][REPOSITORIES] started...");
    return new Promise((resolve, reject) => {

        const repositories = githubOrgs.map(org => getOrgPublicRepos(org));
        Promise.all(repositories)
            .then(data => {
                const allRepos = data.reduce((a, b) => a.concat(b));

                const cleanData = {
                    forks_count: 0,
                    open_issues_count: 0,
                    watchers_count: 0,
                    stargazers_count: 0,
                    language: [],
                    repos: allRepos
                };

                allRepos.forEach(item => {
                    cleanData.forks_count += item.forks_count;
                    cleanData.stargazers_count += item.stargazers_count;
                    cleanData.watchers_count += item.watchers_count;
                    cleanData.open_issues_count += item.open_issues_count;
                    if (item.language) {
                        cleanData.language.push(item.language);
                    }
                });
                cleanData.language = [...new Set(cleanData.language)];
                resolve(cleanData);
                console.log("[GitHub API][REPOSITORIES] done");
            })
            .catch(reject);
    });
}

function getOrgPublicInfo(org) {
    return new Promise((resolve, reject) => {
        paginate(octokit.orgs.get, {
                org
            })
            .then(data => {
                resolve({
                    login: data.login,
                    avatar_url: data.avatar_url,
                    description: data.description,
                    name: data.name,
                    company: data.company,
                    blog: data.blog,
                    location: data.location,
                    public_repos: data.public_repos,
                    public_gists: data.public_gists,
                    followers: data.followers,
                    following: data.following,
                    url: data.html_url,
                    created_at: data.created_at,
                    updated_at: data.updated_at
                });
            })
            .catch(reject);
    });
}


function getAllOrgPublicInfo() {
    console.log("[GitHub API][PUBLIC INFO] started...");
    return new Promise((resolve, reject) => {
        const repositories = githubOrgs.map(org => getOrgPublicInfo(org));
        Promise.all(repositories)
            .then(data => {
                console.log("[GitHub API][PUBLIC INFO] done");
                resolve(data);
            })
            .catch(reject);
    });
}



function getOrgMembers(org) {
    console.log("[GitHub API][MEMBERS] started...");
    return new Promise((resolve, reject) => {
        paginate(octokit.orgs.getMembers, {
                per_page: 100,
                org: org
            })
            .then(data => {
                resolve(data.map(item => {
                    return {
                        login: item.login,
                        avatar: item.avatar_url,
                        profile_url: item.html_url
                    };
                }));
                console.log("[GitHub API][MEMBERS] done");
            })
            .catch(reject);
    });

}


function allData(goblinDB) {
    console.time("[GitHub API]");
    return new Promise((resolve, reject) => {
        console.log("[GitHub API][INFO] has started");
        const dataCollection = [getAllOrgPublicRepos(), getAllOrgPublicActivity(20), getAllOrgPublicInfo(), getOrgMembers("osweekends")];
        Promise.all(dataCollection)
            .then(data => {
                const finalData = {
                    public_repos: data[0],
                    public_activity: data[1],
                    public_info: data[2],
                    members: data[3],
                    generation_date: new Date().getTime()
                };
                goblinDB.set(finalData, "github");
                console.log("[GitHub API][INFO] has finished");
                resolve(finalData);
                console.timeEnd("[GitHub API]");
            })
            .catch(reject);
    });
}

module.exports = {
    allData,
    getAllOrgPublicRepos,
    getAllOrgPublicActivity,
    getAllOrgPublicInfo,
    getOrgMembers
};