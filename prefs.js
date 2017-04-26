const Gtk = imports.gi.Gtk;
const Gdk = imports.gi.Gdk;
const Lang = imports.lang;

const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();

const Settings = new Lang.Class({
    Name: 'TransitTracker.Settings',

    _init: function() {

        this._builder = new Gtk.Builder();
        this._builder.add_from_file(Me.path + '/settings.ui');
    }
});

function init() {

}
