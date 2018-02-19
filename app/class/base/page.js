var fs = require('fs');
var CombinedStream = require('combined-stream');
var config = require('./../../config');
/**
 * Trida slouzi jako zaklad pro ostatni stranky pro zpracovani v cestach pozadavku at.
 * Trida ma reprezentovat kontroler
 * 
 */

class Page {

    constructor(pathHtmlFile, isStreamContent) {
        this.pathHtmlFile = pathHtmlFile;
        this.isStreamContent = isStreamContent;
        this.code = 200;
    }
    //cesta k HTML view souboru
    getPathHtmlFile() {
        return this.pathHtmlFile;
    }
    //vychozi hodnota pro vraceny typ obsahu
    getTypeContent() {
        return 'text/html';
    }
    //vychozi hodnota pro vysledek pozadavku
    getResponseCode() {
        return this.code;
    }
    /**
     * V metoda definujeme jaky obsah chceme do tela vlozit 
     * @param {*} response - odpoved serveru na pozadavek klienta
     */
    getContent(response) {
        var msg = 'Metoda neni definovana.';
        response.write(msg);
        response.write();
    }

    getIsStreamContent() {
        return this.isStreamContent;
    }

    getSetStreamContent(streamBoolean) {
        this.isStreamContent = streamBoolean;
    }

    //Metoda vraci jestli muzeme prijmat pozadavek POST
    canPost() {
        return config.canMethodPostDefault;
    }
    //Metoda craci jestli muzeme prijmat pozadavek GET
    canGet() {
        return config.canAndGetPageRender;
    }

    /**
     * Metoda vraci jestli dany typ pozadavku stranka povoluje zpracovavat
     * @param {string} method  - typ pozadavku
     */
    canRequestMethod(method) {
        switch (method) {
            case 'POST':
                return this.canPost();
                break;
            case 'GET':
                return this.canGet();
                break;
        }
        return false;
    }

    /**
     * Metoda na zaklade nastavenych promennych vygeneruje obsah odpovedi na stranku
     * 
     * Muze generovat obsah do stranky, tak ze nacte ze souboru data a vlozi je do tela stranky. Nebo  generovat obsah z metody getContent, kde vypise obsah primo do tela odpovedi(Response)
     * Volani getContent je provadeno s pomoci AWAIT, abychom pockali, ze v pripade, metody getContent se provadi nacteni z DB napriklad.
     * 
     * Cteni ze souboru je pripraveno pouze pro HTML soubory, ktere vkladame primo mezi hlavicku a paticku layoutu.
     * 
     * @param {*} response - telo odpovedi ze strany serveru
     */
    async getPageRender(response) {

        //nastavei hlavicky 
        response.writeHead(this.getResponseCode(), { 'Content-type': this.getTypeContent() });
        try {
            if (this.getTypeContent() == 'text/html') { //jedna se o stranku s HTML obsahem, nacteme z layoutu hlavicku, paticku a mezi ne vlozime stream dane stranky
                var combinedStream = CombinedStream.create();
                combinedStream.append(fs.createReadStream(__dirname + '/../../view/layout/header.html'));
                combinedStream.append(fs.createReadStream(__dirname + '/../../view/' + this.getPathHtmlFile()));
                combinedStream.append(fs.createReadStream(__dirname + '/../../view/layout/footer.html'));
                //vlozeni stremu do tela odpovedi
                combinedStream.pipe(response);
            } else { //generujeme jiny typ odpovedi nez HTML
                this.getContent(response); // v metoda vkladame text do tela
            }
        } catch (err) {
            Page.errorPageResult(response, err.message);
            console.error(err);
        }
    }

    /**
     * Metoda zpracovava POST pozadavek a predavane parametry
     * Pokud neni ve tride definovan pozadavek, tak ve vychozim stavu vracime, OK, ale neprobiha zadne zpracovani dat na strane serveru
     * @param {*} request - vstupem je REQUEST predany na server 
     * @param {*} response - vystup pro odpoved danou servrem 
     */
    doPostAction(request, response) {
        Page.actionPageResult(response);
    }

    /**
     * V prvnim kroku overime, zda na dany typ pozadavku (POST,GET) je pro danou stranku(kontroler) povolen
     * Pokud ano, tak zpracovavame podle typu pozadavku akci
     * 
     * @param {string} request - vstupem je REQUEST predany na server
     */
    generatePageResponse(request, response) {
        var method = request.method; //ziskani daneho typu metody
        if (this.canRequestMethod(method)) { //mame pravo na dany typ pozadavku 
            switch (method) {
                case 'GET':
                    this.getPageRender(response);
                    break;
                case 'POST':
                    this.doPostAction(request, response);
                    break;
                default:
                    //neni definovany pozadavek napr. PUT, DELETE, tak napiseme, ze je volana nedefinovana akce
                    var message = "Metoda \"" + method + "\" ma povoleni pro tuto URL, ale neni definovana";
                    Page.errorPageResult(response, message);
                    break;
            }
        } else {
            //nemame pravo vypiseme chybu 
            var message = "Metoda \"" + method + "\" neni povolena pro tuto URL";
            Page.errorPageResult(response, message);
        }

    }

    /**
     * Metoda nastavi potrebne hodnoty atributu hlavicky a tela odpovedi kterou chceme vypsat v pripade chyby
     * 
     * @param {*} response  - telo odpovedi
     * @param {*} message  - zprava do obsahu
     * @param {*} code - kod chyby 
     */
    static errorPageResult(response, message, code = 400) {
        response.writeHead(code, { 'Content-type': "text/plain" });
        response.write(message + ''); //pretypovani na string 
        response.end();
    }

    /**
         * Metoda nastavi potrebne hodnoty atributu hlavicky a tela odpovedi kterou chceme vypsat v vychoziho stavu napriklad pro nedefinou akci
         * 
         * @param {*} response  - telo odpovedi
         * @param {*} message  - zprava do obsahu
         * @param {*} code - kod chyby 
         */
    static actionPageResult(response, message = 'Akce nevykonava zadnou praci s daty!', code = 200) {
        response.writeHead(code, { 'Content-type': "text/plain" });
        response.write(message + '');
        response.end();
    }
}

module.exports = Page;