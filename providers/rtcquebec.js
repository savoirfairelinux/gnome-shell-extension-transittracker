// Quebec's RTC provider

const Lang = imports.lang;
const Soup = imports.gi.Soup;

const BUS_CAN_QUE_RTC_URL = "https://wsmobile.rtcquebec.ca/api/v1/horaire/BorneVirtuelle_ArretParcours";

const RTC_LINE_PARAMETER = "noParcours";
const RTC_STOP_PARAMETER = "noArret";
const RTC_DIRECTION_PARAMETER = "noDirection";

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
    // TODO:URL is partial here!
    let request = Soup.Message.new('GET', BUS_CAN_QUE_RTC_URL);
    //_session.queue_message(request, Lang.bind(this,get_callback(session, message)));

    return 'N/A';
    //this.load_json_async(BUS_CAN_QUE_RTC_URL, params, function(json) {
    //        if (json && (Number(json.cod) == 200)) {

    //            if (this.currentBusCache != json)
    //                this.currentBusCache = json;

    //        if (!json['arretNonDesservi']) {
    //            return json['horaires'][0]['departMinutes'];
    //        }
    //        } else {
    //            return 'N/A';
    //        }
    //});
}

// This function should be moved in a common file
function get_callback(session, message) {
    if (message.status_code == 200) {

        transit_infos = {
            line_number: '84',
            stop_number: '1111',
            direction: 1,
            provider: 'RTC',
            updated_at: Date.now
        }
    } else {
        log.error("Request to transit service RTC not succesful");
    }
}
