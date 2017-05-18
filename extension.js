const St = imports.gi.St;
const GLib = imports.gi.GLib;
const Gio = imports.gi.Gio;
const Main = imports.ui.main;

const Me = imports.misc.extensionUtils.getCurrentExtension();
const RTCTransit = Me.imports.providers.rtcquebec;
const DummyTransit = Me.imports.providers.dummy;

let button;
let transitProvider;

function init() {
    button = new St.Bin({ style_class: 'panel-button',
                          reactive: true,
                          can_focus: true,
                          x_fill: true,
                          y_fill: false,
                          track_hover: true });

    init_transit_provider();

    transitProvider.getEstimatedTime(84,1,5167, updateDisplayedETA)
    button.connect('button-press-event', forceUpdate);
}

function init_transit_provider() {
    if (transitProvider == null) {
        //transitProvider = DummyTransit;
        transitProvider = RTCTransit;
    }
}


function updateDisplayedETA(transitResponse) {
    // Reset timer
    let timer_rate = get_timer_refresh_rate(transitResponse.estimatedTime)
    GLib.timeout_add(GLib.PRIORITY_DEFAULT, timer_rate, forceUpdate, null);

    // A bus icon could be nice to have
    // An icon is available! It's name is 'route-transit-symbolic'
    let etaLabel = new St.Label({ text: transitResponse.lineNumber + ' : ' + transitResponse.estimatedTime + ' min'});
    let customIcon = Gio.icon_new_for_string(Me.path + '/icons/transit-symbolic.svg');
    let busIcon = new St.Icon({ icon_size : 14, style_class: 'system-status-icon'});
    busIcon.gicon = customIcon;
    let box = new St.BoxLayout({ vertical: false });
    box.add_actor(busIcon);
    box.add_actor(etaLabel)
    button.set_child(box);
}

function get_timer_refresh_rate(estimatedTimeLeft) {
    let refresh_rate = 900;    // 15 minutes

    if (estimatedTimeLeft >= 15 ) {
        refresh_rate = 300;
    } else if (estimatedTimeLeft < 15 && estimatedTimeLeft >= 5) {
        refresh_rate = 60;
    } else if (estimatedTimeLeft < 5 || estimatedTimeLeft === 'N/A') {
        // It could be a good idea to distiguish an error code from a network error.
        refresh_rate = 30;
    }

    log_message("Returned timer " + refresh_rate);
    return refresh_rate * 1000;
}

function forceUpdate() {
    // Force update require all parameters..
    transitProvider.requestUpdate(84,1,5167);
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
