const Page = require('./page');

/**
 * Kontroler pro stranku ErrorPage 
 * 
 */

class Error404Page extends Page {

    constructor() {
        super("", false);
        this.code = 404;
    }

    getTypeContent() {
        return 'text/plain';
    }

    async getContent() {
        return "Stranka nenalezena";
    }

    //chceme prijmat GET pozadavky, jinak nemuzeme vypsat chybu
    canGet() {
        return true;
    }

}

module.exports = Error404Page;