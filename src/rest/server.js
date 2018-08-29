"use strict";
exports.__esModule = true;
var http = require("http");
var app_1 = require("./app");
var PORT = 80;
var restServer = new app_1.RestServer();
function init() {
    http.createServer(restServer.app).listen(PORT, function () {
        console.log('Express server listening on port ' + PORT);
    });
}
exports["default"] = init;
