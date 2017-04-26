// Quebec's RTC URL
const BUS_CAN_QUE_RTC_URL = "https://wsmobile.rtcquebec.ca/api/v1/horaire/BorneVirtuelle_ArretParcours";
const RTC_LINE_PARAMETER = "noParcours";
const RTC_STOP_PARAMETER = "noArret";
const RTC_DIRECTION_PARAMETER = "noDirection";
const RTC_DATE_PARAMETER = "date"; // Peut-être pas nécessaire

function getEstimatedTime(line, direction, stop) {
    return getData(84,1,5167);
}

function getData(line, direction, stop) {

    let params = {
        noParcours: line,
        noArret: stop,
        noDirection: direction
    };

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
