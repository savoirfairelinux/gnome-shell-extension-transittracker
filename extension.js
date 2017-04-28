const St = imports.gi.St;
const Main = imports.ui.main;
const Me = imports.misc.extensionUtils.getCurrentExtension();
const RTCTransit = Me.imports.providers.rtcquebec;
const DummyTransit = Me.imports.providers.dummy;

let button;
let transitProvider;

// General workflow
// Verify is preferences are set
// Query service
// Cache the result
// Display result

function init() {
    button = new St.Bin({ style_class: 'panel-button',
                          reactive: true,
                          can_focus: true,
                          x_fill: true,
                          y_fill: false,
                          track_hover: true });

    init_transit_provider();

    button.set_child(generateEstimateLabel('84', transitProvider.getEstimatedTime(84,1,5167)));
    //button.set_child(generateEstimateLabel('84', transitProvider.getEstimatedTime(0,0,0)));

    button.connect('button-press-event', forceUpdate);
}

function init_transit_provider() {
    if (transitProvider == null) {
        //transitProvider = DummyTransit;
        transitProvider = RTCTransit;
    }
}

function generateEstimateLabel(lineNumber, estimatedTime) {
    // A  bus icon could be nice to have
    return new St.Label({ text: lineNumber + ' : ' + estimatedTime + ' min'});
}

function get_timer_refresh_rate(estimatedTimeLeft) {
    let refresh_rate = 1800;

    if (estimatedTimeLeft >= 15 ) {
        refresh_rate = 300;
    } else if (estimatedTimeLeft < 15 && estimatedTimeLeft >= 5) {
        refresh_rate = 60;
    } else if (estimatedTimeLeft < 5) {
        refresh_rate = 30;
    }

    return refresh_rate;
}

function forceUpdate() {
    button.set_child(generateEstimateLabel('84', transitProvider.getEstimatedTime(84,1,5167)));
}

function enable() {
    Main.panel._rightBox.insert_child_at_index(button, 0);
}

function disable() {
    Main.panel._rightBox.remove_child(button);
}

function log_message(message) {
    global.log('[transitTracker@vinibo.net] : ' + message);
}
