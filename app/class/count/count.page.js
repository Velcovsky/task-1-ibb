const Page = require('./../base/page');
const Count = require('./count');

/**
 * Kontroler pro stranku Count, 
 * 
 * - v pozadavku GET vracime cislo ulozene v DB
 * 
 */

class CountPage extends Page {

    constructor() {
        super("", false);
    }

    getTypeContent() {
        return 'text/plain';
    }

    //chceme prijmat GET pozadavky
    canGet() {
        return true;
    }

    /**
     * Nacteme z DB zaznam count a nechema jej rovno vypsat do tela stranky
     * @param {*} response - odpoved serveru na pozadavek klienta
     */
    async getContent(response) {
        var countObj = new Count();
        countObj.loadCountFromDbAndSetToResponse(
            function (data) {
                response.write(data);
                response.end();
            });
    }

}

module.exports = CountPage;