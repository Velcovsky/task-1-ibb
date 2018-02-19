const assert = require('./../node_modules/chai').assert;
const Count = require('./../class/count/count');


describe('Unit test for Count', function () {

    it('Test print count value from DB and check is number', function () {

        var countObj = new Count();
        countObj.loadCountFromDbAndSetToResponse(function (data) {
            assert.isNumber(data);
        })

    });

    it('Test set count on zero', function () {
        var countObj = new Count();
        countObj.loadCountFromDbAndSetToResponse(function (data) {

            var negValue = data * (-1);
            countObj.setCount(negValue);
            countObj.addValueAndSave(function (data) {
                assert.equal(data, 0);
            });
        })
    });


    it('Test set on 100', function () {
        var countObj = new Count();
        countObj.loadCountFromDbAndSetToResponse(function (data) {
            //set value on 0
            var negValue = data * (-1);
            countObj.setCount(negValue);
            countObj.addValueAndSave(function (data) {
                countObj.setCount(100);
                countObj.addValueAndSave(function (data) {
                    assert.equal(data, 100);
                });
            });
        })
    })
});