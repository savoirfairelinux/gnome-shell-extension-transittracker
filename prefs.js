const Gtk = imports.gi.Gtk;
const Gdk = imports.gi.Gdk;
const GObject = imports.gi.GObject;
const Lang = imports.lang;

const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();

const SettingsWidget = new GObject.Class({
    Name: 'TransitTracker.Prefs.Widget',
    GTypeName: 'TransitTrackerPrefsWidget',
    Extends: Gtk.Box,

    _init: function(params) {

        this._builder = new Gtk.Builder();
        this._builder.add_from_file(Me.path + '/settings.ui');
        log_message(Me.path + '/settings.ui');
        this.mainWidget = this._builder.get_object("stopPrefBox");
    }
});

function init() {}

function buildPrefsWidget() {
    log_message("Init");
    let prefs = new SettingsWidget();
    let widget = prefs.mainWidget;
    widget.show_all();
    return widget;
}

function log_message(message) {
    global.log('[transitTracker@vinibo.net:prefs.js] : ' + message);
}
