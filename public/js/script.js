const loadingSlctr = document.getElementById("loading-status");

function ajaxRequest(url, cb) {
    const request = new XMLHttpRequest();

    request.onreadystatechange = function() {

        if (request.readyState === 4 && request.status === 200) {
            cb(false, JSON.parse(request.responseText));
        } else if (request.readyState === 4 && request.status === 404) {
            cb(true);
        }
    };
    
    request.open("GET", url, true);
    request.send();
}

function hideLoading () {
    loadingSlctr.style.display = "none";
}


ajaxRequest("api/v1", function (err, data) {
    hideLoading();
    console.log("Data:", data);
});