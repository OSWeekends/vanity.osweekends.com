// Variables
const loadingSlctr = document.getElementById("loading-status");
const errorSlctr = document.getElementById("error-data");
const infoSlctr = document.getElementById("info-wrapper");
const teamSlctr = document.querySelector(".team-section div");
const communiSlctr = document.querySelector(".communities-section div");
const sponsorsSlctr = document.querySelector(".sponsors-section div");

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
 * Generates all the HTML from the AJAX info (team, communities, sponsors)
 * Displays the information container
 * @param {object} data - AJAX response data
 */
function dataShow(data){
    teamSlctr.innerHTML = renderTeam(data.team);
    communiSlctr.innerHTML = renderCommunities(data.communities);
    sponsorsSlctr.innerHTML = renderSponsors(data.sponsors);
    infoSlctr.style.display = "inherit";
}


ajaxRequest("api/v1", function (err, data) {
    err ? errorShow() : dataShow(data);
    console.log("Data: ", data);
    hideLoading();
});