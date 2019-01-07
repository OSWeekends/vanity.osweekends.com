// Variables
const loadingSlctr = document.getElementById("loading-status");
const errorSlctr = document.getElementById("error-data");
const infoSlctr = document.getElementById("info-wrapper");
const teamSlctr = document.querySelector(".team-section div");

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
 * Generates all the HTML from the AJAX info
 * Displays the information container.
 * @param {object} data - AJAX response data
 */
function dataShow(data){
    teamSlctr.innerHTML = renderTeam(data.team);
    infoSlctr.style.display = "inherit";
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

ajaxRequest("api/v1", function (err, data) {
    err ? errorShow() : dataShow(data);
    console.log("Data: ", data);
    hideLoading();
});