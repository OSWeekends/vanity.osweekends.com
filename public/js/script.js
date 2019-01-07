// Variables
const loadingSlctr = document.getElementById("loading-status");
const errorSlctr = document.getElementById("error-data");


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


ajaxRequest("api/v1", function (err, data) {
    err ? errorShow() : console.log("Data:", data);
    hideLoading();
});