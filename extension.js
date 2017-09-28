const St = imports.gi.St;
const GLib = imports.gi.GLib;
const Gio = imports.gi.Gio;
const Main = imports.ui.main;
const Lang = imports.lang;
const Me = imports.misc.extensionUtils.getCurrentExtension();
const Preferences = Me.imports.prefs;
const Convenience = Me.imports.convenience;
const DummyProvider = Me.imports.providers.dummy;

let button;
let transitProvider;
let settings;
let watchedPoints;

function init() {
    button = new St.Bin({ style_class: 'panel-button',
                          reactive: true,
                          can_focus: true,
                          x_fill: true,
                          y_fill: false,
                          track_hover: true });

    this.settingChangedSignals = [];
    init_watched_points();

    button.connect('button-press-event', forceUpdate);
    connect_signal(Preferences.TRANSITTRACKER_SETTINGS_WATCHED_STOPS, Lang.bind(this, this.init_watched_points));
}

function init_watched_points() {
    // Read configuration
    if (Preferences != null) {
        settings = Convenience.getSettings(Preferences.TRANSITTRACKER_SETTINGS_SCHEMA);
        watchedPoints = Preferences.loadWatchedPoints(settings);

        transitProvider = Preferences.getProvider(watchedPoints[0].provider);
        transitProvider.getEstimatedTime(watchedPoints[0], updateDisplayedETA);
    } else {
        transitProvider = DummyProvider;
    }
}

function connect_signal(key, callback) {
    this.settingChangedSignals.push(settings.connect('changed::' + key, callback));
}

function updateDisplayedETA(transitResponse) {
    // Reset timer
    let timer_rate = get_timer_refresh_rate(transitResponse.estimatedTime);
    GLib.timeout_add(GLib.PRIORITY_DEFAULT, timer_rate, forceUpdate, null);

    let etaLabel = new St.Label({ text: transitResponse.lineNumber + ' : ' + transitResponse.estimatedTime + ' min'});
    let customIcon = Gio.icon_new_for_string(Me.path + '/icons/transit-symbolic.svg');
    let busIcon = new St.Icon({ icon_size : 15, style_class: 'system-status-icon'});
    busIcon.gicon = customIcon;

    let box = new St.BoxLayout({ vertical: false });
    box.add_actor(busIcon);
    box.add_actor(etaLabel);
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

    return refresh_rate * 1000;
}

function forceUpdate() {
    transitProvider.requestUpdate();
    // TODO:Reset Timer
}

function enable() {
    Main.panel._rightBox.insert_child_at_index(button, 0);
    // TODO:Start Timer
}

function disable() {
    Main.panel._rightBox.remove_child(button);
    // TODO:Remove Timer
}

function log_message(message) {
    global.log('[transitTracker@vinibo.net] : ' + message);
}
