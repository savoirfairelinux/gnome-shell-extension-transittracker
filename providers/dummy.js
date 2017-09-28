let refresh_frontend_display;
let watchedPoint;

// Dummy provider used for debugging and example
function getEstimatedTime(receivedWatchedPoint, callback) {
    refresh_frontend_display = callback;
    watchedPoint = receivedWatchedPoint;
    return getData(receivedWatchedPoint);
}

function getName() {
    return "Dummy";
}

function getData(watchedPoint) {
    let eta = Math.round(Math.random() * 100);
    global.log("Function getData on dummy called " + watchedPoint.line + " " + eta);
    refresh_frontend_display({lineNumber: watchedPoint.line, estimatedTime: eta});
}

function requestUpdate() {
    getData(watchedPoint);
}
