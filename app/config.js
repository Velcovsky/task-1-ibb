//Definujeme konfiguracni parametry, port at.

var port = 8060; //port na kterem bude applikace spustena
var baseName = "iBillboard - Test 1"; //Nazev aplikace
var storageDir = "D:/iBillboard/storage/";//Cesta k ukladani souboru

var dbNameValuePrefix = "billboard_"; //Prefix pro klice daneho projektu k DB  REDIS
var dbServer = "localhost"; //Adresa DB
var dbPortServer = 6379; //Port DB

var canMethodPostDefault = false; //parametr zda se maji nebo nemaji prijmat GET pozadavky
var canMethodGetDefault = false; //parametr zda se maji nebo nemaji prijmat POST pozadavky

var baseUrlTest = "localhost:8060"; //zaklad URL pro testovani

var functionAll = {
    //Vraceni portu 
    getPort: function () {
        return port;
    },
    //Nazev aplikace
    getAppName: function () {
        return baseName;
    },
    //Cesta k pro zapis POST pozadavku
    getPathFileJson: function () {
        return pathFileJson;
    },
    //Adresa DB serveru (hosta)
    getDbServer: function () {
        return dbServer;
    },
    //Port DB na serveru (hostu)
    getDbPortServer: function () {
        return dbPortServer;
    },
    //Metoda vraci umisteni souboru k ukladani, pro upload at.
    getStorageDir: function () {
        return storageDir;
    },
    //metoda vraci zaklad URL adresy pro testovani
    getUrlBaseForTest: function () {
        return 'http://localhost:8060';
    }
};


module.exports = functionAll;