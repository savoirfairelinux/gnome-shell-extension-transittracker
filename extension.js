const St = imports.gi.St;
const Main = imports.ui.main;
const Me = imports.misc.extensionUtils.getCurrentExtension();
const RTCTransit = Me.imports.rtcquebec;
//const Tweener = imports.ui.tweener;

let button;
let transitProvider;

// General workflow
// Verify is preferences are set
// Query service
// Cache the result
// Display result

function _forceUpdate() {
    
    button.set_child(generateEstimateLabel('84', getEstimatedTime()));
}

function init() {
    button = new St.Bin({ style_class: 'panel-button',
                          reactive: true,
                          can_focus: true,
                          x_fill: true,
                          y_fill: false,
                          track_hover: true });
    
    estimatedTime = getEstimatedTime();

    // Two possibilities. 1. A click force refresh times 2. A click shows a popup with more lines (First option good for first impl)
    button.set_child(generateEstimateLabel('84', estimatedTime));

    button.connect('button-press-event', _forceUpdate);
}

function generateEstimateLabel(lineNumber, estimatedTime) {
    return new St.Label({ text: lineNumber + ' : ' + estimatedTime + ' min'});
}

function getEstimatedTime() {
    let params = {
        noParcours: 74,
        noArret: 1125,
        noDirection: 0
    };
    estimatedTime = RTCTransit.getEstimatedTime(84,1,5167);
    //return rtcTransit.getEstimatedTime(84,1,5167);
    // transitProvider.getEstimatedTime(84,1,5167);
    return estimatedTime;
}

function get_timer_refresh_rate(estimatedTimeLeft) {
    if (estimatedTimeLeft >= 15 ) {
        return 300;
    } else if (estimatedTimeLeft < 15 && estimatedTimeLeft >= 5) {
        return 60;
    } else if (estimatedTimeLeft < 5) {
        return 30;
    } else {
        return 1800;
    }
}

function enable() {
    Main.panel._rightBox.insert_child_at_index(button, 0);
}

function disable() {
    Main.panel._rightBox.remove_child(button);
}
