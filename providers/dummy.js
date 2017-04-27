// Dummy provider used for debugging and example
function getEstimatedTime(line, direction, stop) {
    return getData(line, direction, stop);
}

function getData(line, direction, stop) {
    global.log("Function getData on dummy called");
    return Math.random() * 100;
}
