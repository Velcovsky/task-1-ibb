//JS pro spusteni APP

//nacteni configu
const config = require('./config');
//nacteni cest pro akce a nacitani stranek
const routes = require('./routes');

var db = require('./class/database/database');

//vytvoreni serveru
var http = require('http');
var server = http.createServer(async function (req, res) {
    //kontrola cest(routing)
    routes(req, res);
});
//spusteni na portu
server.listen(config.getPort());