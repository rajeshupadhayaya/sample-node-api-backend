import {UtilHelper} from "./util.helper";

describe('Util Helper', () => {

    it('should get populated object with selected fields', function () {

        const populateObject = UtilHelper.getPopulateObjectFromString('subject_f=_id|name|addedBy:topic,batch');

        expect(populateObject).toMatchSnapshot();
    });
});
