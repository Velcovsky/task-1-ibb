/**
 * Trida obsahuje potrebne funkce pro praci s DB 
 */
const config = require('./../../config');
const redis = require('./../../node_modules/redis'); 

class Database {

    constructor() {
        this.port = config.getDbPortServer();
        this.host = config.getDbServer();
        this.connection = null;
    }

    //pripojeni k DB
    async connect() {
        if (this.connection == null) { //pokud neexistuje pripojeni, tak vytvorime
            this.connection = await redis.createClient(this.port, this.host);
        }
        return this.connection;
    }

    /**
     * Metoda vraci z databaze hodnotu podle klice a vklada do tela odpovedi pro vypsani do stranky
     * @param {string} key  - klic atributu ktery chceme ziskat z DB
     * @param {*} callback  - Akce kteta se ma vykonat po dokonceni nacteni dat, predavame vzdy jeden parametr a to vysledek akce
     */
    async actionGetValueAndSetToResponse(key, callback = null) {
        var client = await this.connect();

        client.on("error", function (err) {
            var msgErr = "Database - actionGetValueAndSetToResponse - Err: " + err;
            if (callback != null) {
                callback(msgErr);
            }
            console.error(msgErr);
        });

        await client.get(key, function (err, reply) {
            client.quit();
            if (err) {
                var msgErr = "Database - actionGetValueAndSetToResponse - Action - Err: " + err;
                console.error(msgErr);
                if (callback != null) {
                    callback(msgErr);
                }
            } else {
                if (callback != null) {
                    callback(reply);
                }
            }
        });

    }

    /**
     * Metoda zvysi na danem klici aktulniho hodnotu o zadanou
     * pokud dany klic neexistuje, tak jej vytvori
     * @param {string} key -  identifikator zaznamu
     * @param {float} value -  hodnota o kterou chceme zvysit soucasnou hodnotu
     * @param {*} callback  - Akce kteta se ma vykonat po dokonceni nacteni dat
     */
    async actionIncrementFloatValue(key, value, callback) {
        var client = await this.connect();

        client.on("error", function (err) {
            console.error("Database - actionIncrementFloatValue - Err: " + err);
            if (callback != null) {
                callback(msgErr);
            }
        });

        client.incrbyfloat(key, value, function (err, reply) {
            client.quit();
            if (err) {
                console.error("Database - actionIncrementFloatValue - Action - Err: " + err);
                if (callback != null) {
                    callback(msgErr);
                }
            } else {
                if (callback != null) {
                    callback(reply);
                }
            }
        });
    }

}

module.exports = Database;