const Page = require('./../base/page');

/**
 * Kontroler pro domovskou stranku
 */

class HomePage extends Page {

    constructor() {
        super("home/home.html", true);
    }

    //chceme prijmat GET pozadavek protoze jsme na homePage, jinak nezobrazime obsah
    canGet() {
        return true;
    }
}

module.exports = HomePage;