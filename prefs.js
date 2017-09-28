const Gtk = imports.gi.Gtk;
const Gdk = imports.gi.Gdk;
const GObject = imports.gi.GObject;
const Gio = imports.gi.Gio;
const Lang = imports.lang;

const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();

const Convenience = Me.imports.convenience;

const TRANSITTRACKER_SETTINGS_SCHEMA = 'org.gnome.shell.extensions.transittracker';
const TRANSITTRACKER_SETTINGS_WATCHED_STOPS = 'watched-stops';

const SettingsWidget = new GObject.Class({
    Name: 'TransitTracker.Prefs.Widget',
    GTypeName: 'TransitTrackerPrefsWidget',
    Extends: Gtk.Box,

    _init: function(params) {
        this._builder = new Gtk.Builder();

        // Read configuration
        this.settings = Convenience.getSettings(TRANSITTRACKER_SETTINGS_SCHEMA);

        this._scanProviders();

        // UI init should be moved in its own method
        this._builder.add_from_file(Me.path + '/settings.ui');
        this.mainWidget = this._builder.get_object("stopPrefBox");
        this.providerList = this._builder.get_object("cboProviders");

        this.cancelButton = this._builder.get_object("btnCancel");
        this.applyButton = this._builder.get_object("btnApply");    // Not really needed with SettingsBindings

        this.lineNumber = this._builder.get_object("txtLineNumber");
        this.stopNumber = this._builder.get_object("txtStopNumber");
        this.directionCode = this._builder.get_object("txtDirection");

        this._populateProviderList(this.providerList);

        this._loadWatchedPoints();
        this._populateWatchedPoint();
        this._connectUpdateSignals();

        // Connect buttons signals
        //this.cancelButton.connect("clicked", Lang.bind(this, this._builder.destroy));
        this.applyButton.connect("clicked", Lang.bind(this, this._saveValues));

    },

    // This function set bindings on settings.
    // This way, everytime a value is changed, a signal is sent and the 'extension'
    // listens to these events. It allow live changes in frontend.
    _connectUpdateSignals: function() {

        this.lineNumber.connect("focus-out-event", Lang.bind(this, this._saveValues));
        this.stopNumber.connect("focus-out-event", Lang.bind(this, this._saveValues));
        this.directionCode.connect("focus-out-event", Lang.bind(this, this._saveValues));
    },

    _scanProviders: function() {
        this.providers = scanProviders();
    },

    _saveValues: function() {
        // Create JSON object from form values
        let selectedProvider = this.providers[this.providerList.get_active()];

        let newSettings = {
                            "provider" : selectedProvider,
                            "line" : this.lineNumber.get_text(),
                            "direction" : this.directionCode.get_text(),
                            "stop" : this.stopNumber.get_text(),
                            };

        var stringSettings = JSON.stringify(newSettings);
        this.watchedPoints = [];
        this.watchedPoints.push(stringSettings);   // Create duplicates

        this.settings.set_strv(TRANSITTRACKER_SETTINGS_WATCHED_STOPS, this.watchedPoints);
    },

    _loadWatchedPoints: function() {
        if (this.settings != null) {
            this.watchedPoints = loadWatchedPoints(this.settings);
        }
    },

    _populateWatchedPoint: function() {
        if (this.watchedPoints != null) {
            var defaultPoint = this.watchedPoints[0];
            var providerIndex = this.providers.indexOf(defaultPoint.provider);
            this.providerList.set_active(providerIndex);
            this.lineNumber.set_text(defaultPoint.line);
            this.stopNumber.set_text(defaultPoint.stop);
            this.directionCode.set_text(defaultPoint.direction);
        }
    },

    _populateProviderList: function() {
        for (var provider in this.providers) {
            this.providerList.append_text(this.providers[provider]);
        }
    }
});

// useless but required
function init() {}

function buildPrefsWidget() {
    let prefs = new SettingsWidget();
    let widget = prefs.mainWidget;
    widget.show_all();
    return widget;
}

function loadWatchedPoints(settings) {
    let watchedPoints = [];
    if (settings != null) {
        var loadedWatchedPoints = settings.get_strv(TRANSITTRACKER_SETTINGS_WATCHED_STOPS);

        for (var point in loadedWatchedPoints) {
            var parsedPoint = JSON.parse(loadedWatchedPoints[point]);
            watchedPoints.push(parsedPoint);
        }
    }

    return watchedPoints;
}

function scanProviders() {
    let providers = Me.imports.providers;
    let loadedProviders = [];

    for (var provider in providers) {
        let scannedProvider = eval('Me.imports.providers.' + provider.toString());
        loadedProviders.push(scannedProvider.getName());
    }
    return loadedProviders;
}

function getProvider(providerName) {
    let loadedProviders = Me.imports.providers;

    for (var provider in loadedProviders) {
        let scannedProvider = eval('Me.imports.providers.' + provider.toString());
        if (scannedProvider.getName() == providerName) {
            return scannedProvider;
        }
    }
}

function log_message(message) {
    global.log('[transitTracker@vinibo.net:prefs.js] : ' + message);
}
