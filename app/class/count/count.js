const Database = require('./../database/database');

/**
 * Trida obsahuje metody pro praci s objektem Count
 * 
 * Objekt ma pouze jednu promennou, ktery byt pouze ciselne hodnoty
 */

class Count {

    constructor() {
        this.count = 0;
        this.dbColumn = 'count'; //nazev sloupce v DB
    }

    getCount() {
        return this.count;
    }

    setCount(count) {
        if (Number(parseFloat(count)) === count) { //overime zda hodnota je cislo
            this.count = count;
        }
    }

    /**
     * Nacteni zaznamu count primo z DB a zapsani do odpovedi serveru
     * @param {*} response - odpoved serveru na pozadavek klienta
     */
    async loadCountFromDbAndSetToResponse(callback = null) {
        try {
            var db = new Database();
            await db.actionGetValueAndSetToResponse(this.dbColumn, callback);
        } catch (err) {
            console.error(err);
        }
    }

    /**
     * Metoda pricte k aktualnimu zaznamu 'count' v DB danou hodnotu, pokud zaznam neexistuje tak jej vytvorime a nastavime hodnotu
     * Nechavame ulozit i hodnotu 0, proto i proto i nekontrolujeme, jestli uzivatel posle k pricteni 0
     * @param {number} count - hodnota, kterou chceme pricist k aktualni hodnote zaznamu v DB
     * @param {*} callback - metoda kterou chceme vykonat po skonceni v DB
     */
    async addValueAndSave(callback = null) {
        try {
            var db = new Database();
            await db.actionIncrementFloatValue(this.dbColumn, this.getCount(), callback);
        } catch (err) {
            console.error(err);
        }
    }
}



module.exports = Count;