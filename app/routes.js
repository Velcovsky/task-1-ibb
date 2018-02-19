var HomePage = require('./class/home/home.page');
var TrackPage = require('./class/track/track.page');
var CountPage = require('./class/count/count.page');
var Error404Page = require('./class/base/error.page');
/**
 * Metoda se stara o smerovani na jednotlive Page, jestli je dany typ pozadavku povolen 
 * @param {*} request - http Request
 */
var route = async function (request, response) {

    var path = request.url; //ziskani URL

    switch (path) {
        case '/home':
        case '/':
            var homePage = new HomePage();
            homePage.generatePageResponse(request, response);
            break;
        case '/track':
            var trackPage = new TrackPage();
            trackPage.generatePageResponse(request, response);
            break;
        case '/count':
            var countPage = new CountPage();
            countPage.generatePageResponse(request, response);
            break;
        default:
            //neznama URL adresa, tak chodime 404
            var errorPage = new Error404Page();
            errorPage.generatePageResponse(request, response);
            break;
    }
}

module.exports = route;

