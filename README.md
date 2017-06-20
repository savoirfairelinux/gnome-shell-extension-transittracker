gnome-shell-extension-transittracker
====================================
![Screenshot](https://gitlab.com/Vinibo/gnome-shell-extension-transittracker/raw/b677336868bf88d7f0d613635a1931b48badef2a/data/Screenshot-transittracker.png)

Transittracker is a Gnome extension to help you keep track of passage times of buses, trains, subway and others public transportation means.

This extension let you set a line and a given stop and tell you in how much time your transport will arrive, in a convenient way directly in the shell.

### Supported providers:
- Réseau de Transport de la Capitale (RTC: http://www.rtcquebec.ca)

### Installation:
#### From git
    git clone https://gitlab.com/Vinibo/gnome-shell-extension-transittracker.git
    mkdir -p ~/.local/share/gnome-shell/extensions
    cd ~/.local/share/gnome-shell/extensions
    ln -s <path-to-source-code> ./transittracker@vinibo.net
restart GNOME Shell (`Alt+F2`, `r`, `Enter`) and enable the extension through gnome-tweak-tool.
This command may not work if running in a Wayland session. Restart your Gnome session to see the plugin load.

#### From extensions.gnome.org
The extension is not yet published on this website. There are some adjustements that needs to be done before posting it there.

### Inspiration:
I would like to thank the authors of two extension that I've used to get inspiration:
- jenslody (Openweather: https://github.com/jenslody/gnome-shell-extension-openweather)
- UshakovVasilii (Freon: https://github.com/UshakovVasilii/gnome-shell-extension-freon)
