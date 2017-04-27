const Gtk = imports.gi.Gtk;
const Gdk = imports.gi.Gdk;
const GObject = imports.gi.GObject;
const Lang = imports.lang;

const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();

const SettingsWidget = new GObject.Class({
    Name: 'TransitTracker.Settings',
    Extends: Gtk.Window,

    _init: function() {

        this._builder = new Gtk.Builder();
        this._builder.add_from_file(Me.dir.path + '/settings.ui');
        this.mainWidget = this.Window.get_object("prefWindow");
    }
});

function init() {}

function buildPrefsWidget() {
    let prefs = new SettingsWidget();
    let widget = prefs.mainWidget;
    widget.show_all();
    return widget;
}
