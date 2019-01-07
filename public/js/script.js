// Variables
const loadingSlctr = document.getElementById("loading-status");
const errorSlctr = document.getElementById("error-data");
const infoSlctr = document.getElementById("info-wrapper");
const teamSlctr = document.querySelector(".team-section div");
const communiSlctr = document.querySelector(".communities-section div");
const sponsorsSlctr = document.querySelector(".sponsors-section div");
const twitterSlctr = document.querySelector(".info-twitter .card-body");
const slackSlctr = document.querySelector(".info-slack .card-body");
const meetupSlctr = document.querySelector(".info-meetup .card-body");
const githubSlctr = document.querySelector(".info-github .card-body");


// Functions

/** 
 * Ajax request handler
 * @param {string} url - the URL which we're addressing to for the AJAX request
 * @param {requestCallback} cb - The callback that handles the response.
 */
 
 /**
 * @callback requestCallback
 * @param {boolean} err - has an error true/false
 * @param {object|boolean} data - The information/response from the server
 */
function ajaxRequest(url, cb) {
    const request = new XMLHttpRequest();

    request.onreadystatechange = function() {

        if (request.readyState === 4 && request.status === 200) {
            cb(false, JSON.parse(request.responseText));
        } else if (request.readyState === 4 && request.status !== 200) {
            cb(true);
        }
    };
    
    request.open("GET", url, true);
    request.send();
}

/** 
 * Hides loading page image
 */
function hideLoading () {
    loadingSlctr.style.display = "none";
}

/** 
 * Displays error message
 */
function errorShow(){
    errorSlctr.style.display = "inherit";
}

/** 
 * Generates the HTML for rendering the team' members info
 * @param {array} team - Team members' details from AJAX
 * @return {string} - HTML generated 
 */
function renderTeam(team){
    let html = "";
    team.forEach(function(member){
        html += `<a href="${member.Twitter}" target="_blank" alt="${member.name} in Twitter">${member.name}</a>`;
    }); 
    return html;
}

/** 
 * Generates the HTML for rendering the communities info
 * @param {array} communities - Communities' details from AJAX
 * @return {string} - HTML generated 
 */
function renderCommunities(communities){
    let html = "";
    communities.forEach(function(comm){
        html += `<a href="${comm.url}" target="_blank" alt="${comm.name} website">${comm.name}</a>`;
    }); 
    return html;
}

/** 
 * Generates the HTML for rendering the sponsors info
 * @param {array} sponsors - Sponsors' details from AJAX
 * @return {string} - HTML generated 
 */
function renderSponsors(sponsors){
    let html = "";
    sponsors.forEach(function(group){
        html += `<a href="${group.url}" target="_blank" alt="${group.name} website">${group.name}</a>`;
    }); 
    return html;
}

/** 
 * Generates the HTML for rendering Twitter info
 * @param {object} data - Twitter' details from AJAX
 * @return {string} - HTML generated 
 */
function renderTwitter(data){
    return `<h5 class="card-title"><a href="https://twitter.com/os_weekends" target="_blank" alt="OSW Twitter account">Twitter</a></h5>
    <p class="card-figures">${data.tweets} Tweets</p>
    <p class="card-figures">${data.following} Following</p>
    <p class="card-figures">${data.followers} Followers</p>
    <p class="card-figures">${data.likes} Likes</p>`
}

/** 
 * Generates the HTML for rendering Slack info
 * @param {object} data - Slack' details from AJAX
 * @return {string} - HTML generated 
 */
function renderSlack(data){
    return `<h5 class="card-title"><a href="https://invitations-osweekends.herokuapp.com/" target="_blank" alt="OSW Slack invitation">Slack</a></h5>
    <p class="card-figures">${data.users.total} Users</p>
    <p class="card-figures">${data.users.active_readers} Active-readers</p>
    <p class="card-figures">${data.users.active_writers} Active-writers</p>
    <p class="card-figures">${data.dicussion.messages_total} Messages</p>`
}

/** 
 * Generates the HTML for rendering MeetUp info
 * @param {object} data - MeetUp' details from AJAX
 * @return {string} - HTML generated 
 */
function renderMeetup(data){
    return `<h5 class="card-title"><a href="https://www.meetup.com/es-ES/Open-Source-Weekends/" target="_blank" alt="OSW MeetUp account">MeetUp</a></h5>
    <p class="card-figures">${data.total_members} Members</p>
    <p class="card-figures">${data.next_events} Future events</p>
    <p class="card-figures">${data.previous_events} Past events</p>`
}

/** 
 * Generates the HTML for rendering GitHub info
 * @param {object} data - GitHub' details from AJAX
 * @return {string} - HTML generated 
 */
function renderGithub(data){
    return `<h5 class="card-title"><a href="https://github.com/OSWeekends" target="_blank" alt="OSW GitHub account">GitHub</a></h5>
    <p class="card-figures">${data.members.length} Members</p>
    <p class="card-figures">${data.public_info.length} Organizations</p>
    <p class="card-figures">${data.public_repos.repos.length} Repositories</p>
    <p class="card-figures">${data.public_repos.language.length} Languages</p>`
}


/** 
 * Generates all the HTML from the AJAX info (team, communities, sponsors)
 * Displays the information container
 * @param {object} data - AJAX response data
 */
function dataShow(data){
    teamSlctr.innerHTML = renderTeam(data.team);
    communiSlctr.innerHTML = renderCommunities(data.communities);
    sponsorsSlctr.innerHTML = renderSponsors(data.sponsors);
    twitterSlctr.innerHTML = renderTwitter(data.twitter);
    slackSlctr.innerHTML = renderSlack(data.slack);
    meetupSlctr.innerHTML = renderMeetup(data.meetup);
    githubSlctr.innerHTML = renderGithub(data.github);
    infoSlctr.style.display = "inherit";
}


ajaxRequest("api/v1", function (err, data) {
    err ? errorShow() : dataShow(data);
    hideLoading();
});