const fs = require('fs');
const config = require('./../../config');
const Page = require('./../base/page');
const ErrorPage = require('./../base/error.page');
const Database = require('./../database/database');
const Count = require('./../count/count');


/**
 * Kontroler pro Track stranku
 *  - zde budeme pouze zpracovavat POST pozadavek
 */

class TrackPage extends Page {

    constructor() {
        super("", false);
    }

    getTypeContent() {
        return 'text/plain';
    }

    /**
     * Definujeme,jak bude POST request zpracovavan
     * @param {*} request 
     */
    doPostAction(request, response) {
        try {

            //overime, ze prijmany obsah je typu JSON 
            if (request.headers['content-type'] == 'application/json') {
                //zpracovani dat do JSON 
                this.makeRequestPostDataToJson(request, response);

            } else {
                var err = "Content is not JSON";
                throw new Error(err);
                TrackPage.errorPageResult(response, err);
            }
        } catch (err) {
            TrackPage.errorPageResult(response, err);
        }
    }

    /**
     * Metoda zpracuje data z POST pozadavku a prevede je na JSON
     */
    makeRequestPostDataToJson(request, response) {
        try {
            var postData = '';
            request.on('data', function (data) {
                postData += data;
                //omezeni na delku vstupnich dat, ochrana proti utoku (napr. jednoduchy skript, ktery posila "nekonecny" pocet dat)
                if (postData.length > 1e6) {
                    request.connection.destroy();
                    throw new Error('POST data too long.');
                }
            });

            request.on('end', function () {
                try {
                    var jsonObj = JSON.parse(postData);
                    if (jsonObj.count) { //existuje v JSON parametr count, tak nastavime tuto hodnotu a ulozime do DB pokud je cislo
                        var count = new Count();
                        count.setCount(jsonObj.count); //pouzivame setter, ma vlozenou validaci
                        count.addValueAndSave(); //pricteme hodnotu ke klici "count"
                    }
                    TrackPage.writeToFile(postData); //ulozime text do souboru
                    TrackPage.actionPageResult(response, "Akce probehla v poradku");
                } catch (err) {
                    TrackPage.errorPageResult(response, err);
                    console.error(err);
                }
            });
        } catch (err) {
            TrackPage.errorPageResult(response, err);
            console.error(err);
        }
    }

    /**
     * Metoda prida text do souboru, ktery je ulozen na disku
     * @param {string} text vstupni text, ktery se ma pridat do souboru
     */
    static writeToFile(text) {
        try {
            fs.appendFileSync(config.getStorageDir() + '/resultAppend.txt', text, function (err) {
                if (err) { //chyba pri pridavani textu do souboru
                    console.error(err);
                }
            });
        } catch (err) {
            console.error(err);
        }
    }

    //chceme prijmat POST pozadavek
    canPost() {
        return true;
    }
}

module.exports = TrackPage;