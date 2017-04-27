// Quebec's RTC provider

const Lang = imports.lang;
const Soup = imports.gi.Soup;

const BUS_CAN_QUE_RTC_URL = "https://wsmobile.rtcquebec.ca/api/v1/horaire/BorneVirtuelle_ArretParcours";

const RTC_LINE_PARAMETER = "noParcours";
const RTC_STOP_PARAMETER = "noArret";
const RTC_DIRECTION_PARAMETER = "codeDirection";
const RTC_SOURCE_PARAMETER = "source"

const RTC_LINE_KEY = "parcours";
const RTC_STOP_KEY = "arret";
const RTC_NOT_DESERVED_KEY = "arretNonDesservi";
const RTC_SCHEDULE_KEY = "horaires";
const RTC_ESTIMATED_TIME = "departMinutes";

// Dans la réponse du RTC, un flag ntr est présent sur les entrées de 'horaires'
// ntr signifie : Nomade Temps Réel!

let _session = new Soup.SessionAsync();

let transit_infos;

function getEstimatedTime(line, direction, stop) {
    return getData(84,1,5167);
}

function getData(line, direction, stop) {
    url = build_url(line, direction, stop);
    let request = Soup.Message.new('GET', url);
    _session.queue_message(request, Lang.bind(this,get_callback));

    if (transit_infos != null) {
        return transit_infos.estimated_time;
    } else {
        return 'N/A';
    }
}

function build_url(line, direction, stop) {
    let url = BUS_CAN_QUE_RTC_URL + '?'
            // I tried to be honnest by sending the extension name, but the request got rejected
            + RTC_SOURCE_PARAMETER + '=' + 'siteMobile' + '&'
            + RTC_LINE_PARAMETER + '=' + line + '&'
            + RTC_STOP_PARAMETER + '=' + stop + '&'
            + RTC_DIRECTION_PARAMETER + '=' + direction;

    log_message('RTC builded URL :' + url);

    return url;
}

// This function should be moved in a common file
function get_callback(session, message) {
    if (message.status_code == 200) {
        let json_data = JSON.parse(message.response_body.data);
        transit_infos = {
            line_number: json_data[RTC_LINE_KEY][RTC_LINE_PARAMETER],
            stop_number: json_data[RTC_STOP_KEY][RTC_STOP_PARAMETER],
            estimated_time: json_data[RTC_SCHEDULE_KEY][0][RTC_ESTIMATED_TIME],
            direction: 1,
            provider: 'RTC',
            updated_at: Date.now
        }
        log_message(JSON.stringify(transit_infos));
    } else {
        log_message("Request to transit service RTC not succesful with code " + message.status_code);
    }
}

function log_message(message) {
    global.log('[transitTracker@vinibo.net] : ' + message);
}
