const config = require('./../config');
const assert = require('./../node_modules/chai').assert;
const routes = require('./../routes');
var request = require('./../node_modules/request');
var http = require('http');

describe('Unit test for routes and request method', function () {

    var countUrl = '/count';
    var trackUrl = '/track';

    //test cest 
    it("Test GET request on a '/track' route is response 400", async function () {
        var urlAction = config.getUrlBaseForTest() + trackUrl;

        http.get(urlAction, function (res) {
            assert.notEqual(res.statusCode, 200);
        });
    });

    it("Test POST request on a '/track' route is response 200", function () {
        var urlAction = config.getUrlBaseForTest() + trackUrl;
        request.post({
            headers: { 'content-type': 'application/json' },
            url: urlAction,
            body: '{ "number": 30, "count": -50}'
        }, function (error, res, body) {
            assert.equal(res.statusCode, 200);
        });
    });


    it("Wrong format JSON, Test POST request on a '/track' route is response 400", function () {
        var urlAction = config.getUrlBaseForTest() + trackUrl;
        request.post({
            headers: { 'content-type': 'application/json' },
            url: urlAction,
            body: '{ "number": 30, "count": -50 },,,,,,,,'
        }, function (error, res, body) {
            assert.equal(res.statusCode, 400);
        });
    });

    it("Test GET request on a '/count' route is response 200", function () {
        var urlAction = config.getUrlBaseForTest() + countUrl;
        http.get(urlAction, function (res) {
            assert.equal(res.statusCode, 200);
        });
    });

    it("Test POST request on a '/count' route is not response 200", function () {
        var urlAction = config.getUrlBaseForTest() + countUrl;
        request.post({
            headers: { 'content-type': 'application/json' },
            url: urlAction,
            body: '{ "number": 30, "count": -50}'
        }, function (error, res, body) {
            assert.notEqual(res.statusCode, 200);
        });
    });

});