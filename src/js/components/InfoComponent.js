// import moment from 'moment';
import proj4 from 'proj4';
import i18next from 'i18next';
import { formatLocale } from 'd3';
import { round } from '../utils/numbers';

class RIAInfo {
    constructor(earthquakeInfo, sheetType) {
        this.infoTime = document.getElementById('info-time');
        this.infoDate = document.getElementById('info-date');
        this.infoDepth = document.getElementById('info-depth');
        this.infoIntensity = document.getElementById('info-intensity');
        this.infoAuswertung = document.getElementById('info-auswertung');
        this.infoSwiss = document.getElementById('info-swiss');
        this.infoMeta = document.getElementById('info-meta');

        this.overviewMagnitude = document.getElementById('overview-magnitude');
        this.overviewText = document.getElementById('overview-text');
        this.overviewWarnlevels = document.getElementsByClassName('overview__stufe__number');
        this.overviewPlaces = document.getElementsByClassName('overview-place');

        // this.headerDatetime = document.getElementById('header-datetime');
        this.headerTitle = document.getElementById('header-title');
        this.headerWappen = document.getElementById('header-wappen');
        this.headerKuerzel = document.getElementById('header-kuerzel');

        earthquakeInfo.then((info) => this.replaceInfoTable(info));
        earthquakeInfo.then((info) => this.replaceOverviewText(info, sheetType));
        earthquakeInfo.then((info) => this.replaceHeaderText(info, sheetType));

        proj4.defs(
            'EPSG:2056',
            '+proj=somerc +lat_0=46.9524055555556 +lon_0=7.43958333333333 +k_0=1 +x_0=2600000 +y_0=1200000 +ellps=bessel +towgs84=674.374,15.056,405.346,0,0,0,0 +units=m +no_defs +type=crs'
        );
    }

    replaceInfoTable(info) {
        const [l, b] = proj4('EPSG:2056', [info.longitude_value, info.latitude_value]);

        [this.infoDate.innerHTML, this.infoTime.innerHTML] = info.time_value?.split('T') || [
            '-',
            '-',
        ];

        this.infoDepth.innerHTML = info.depth_value;
        this.infoIntensity.innerHTML = round(info.magnitude_value, 1);
        this.infoAuswertung.innerHTML = i18next.t('ueberblick-auswertung-val');
        let formatter = formatLocale({ thousands: "'", grouping: [3] }).format(',.0f');
        this.infoSwiss.innerHTML = `${formatter(l)} / ${formatter(b)}`;
        this.infoMeta.href = 'http://seismo.ethz.ch';
    }

    replaceOverviewText(info, sheetType) {
        this.overviewMagnitude.innerHTML = info.magnitude_value;
        this.overviewText.innerHTML = info[`description_${i18next.resolvedLanguage}`];
        let warnlevel = 5;
        this.overviewWarnlevels[warnlevel - 1].classList.add('active');
        let text =
            sheetType === 'CH'
                ? i18next.t('national-schweiz')
                : `${i18next.t('national-kanton')} ${sheetType}`;
        Array.from(this.overviewPlaces).forEach((el) => {
            el.innerHTML = text;
        });
    }

    replaceHeaderText(info, sheetType) {
        // let date = moment(info.calculation[0].creationinfo.creationtime);
        // this.headerDatetime.innerHTML = date.format('D.MM.YYYY, HH:mm');

        this.headerTitle.innerHTML = info.event_text;
        this.headerKuerzel.innerHTML = sheetType;
        this.headerWappen.src = `images/wappen/${sheetType || 'CH'}.png`;
    }
}

export default RIAInfo;
