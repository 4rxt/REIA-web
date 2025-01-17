import { getBuildingCosts, getCasualties, getDisplaced } from '../utils/api';
import getLatestCalculation from '../utils/data';

class RIAScale {
    constructor(earthquakeInfo, sheetType) {
        this.casualties = document.getElementById('loss-casualties');
        this.displaced = document.getElementById('loss-displaced');
        this.buildingCosts = document.getElementById('loss-buildingcosts');

        this.casualtiesPromise = null;
        this.displacedPromise = null;
        this.buildingsPromise = null;

        earthquakeInfo.then((info) => {
            let loss = getLatestCalculation(info, 'loss');
            this.addScaleData(loss._oid, sheetType);
        });
    }

    returnPromises = () => [this.casualtiesPromise, this.displacedPromise, this.buildingsPromise];

    addScaleData(lossId, sheetType) {
        this.casualtiesPromise = getCasualties(lossId, sheetType).then((data) => {
            if (sheetType !== 'CH') [data] = data;
            this.casualties.setAttribute('mean', data.mean);
            this.casualties.setAttribute('q10', data.quantile10);
            this.casualties.setAttribute('q90', data.quantile90);
        });
        this.displacedPromise = getDisplaced(lossId, sheetType).then((data) => {
            if (sheetType !== 'CH') [data] = data;
            this.displaced.setAttribute('mean', data.mean);
            this.displaced.setAttribute('q10', data.quantile10);
            this.displaced.setAttribute('q90', data.quantile90);
        });
        this.buildingsPromise = getBuildingCosts(lossId, sheetType).then((data) => {
            if (sheetType !== 'CH') [data] = data;
            this.buildingCosts.setAttribute('mean', data.mean);
            this.buildingCosts.setAttribute('q10', data.quantile10);
            this.buildingCosts.setAttribute('q90', data.quantile90);
        });
    }
}
export default RIAScale;
