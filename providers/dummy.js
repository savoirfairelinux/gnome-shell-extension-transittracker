let _refresh_frontend_display;

// Dummy provider used for debugging and example
function getEstimatedTime(line, direction, stop, callback) {
    _refresh_frontend_display = callback;
    return getData(line, direction, stop, callback);
}

function getData(line, direction, stop) {
    lineNumber = Math.round(Math.random() * 100);
    eta = Math.round(Math.random() * 100);
    global.log("Function getData on dummy called " + lineNumber + " " + eta);
    _refresh_frontend_display({lineNumber: lineNumber, estimatedTime: eta});
}

function requestUpdate(line, direction, stop) {
    getData(line, direction, stop);
}
