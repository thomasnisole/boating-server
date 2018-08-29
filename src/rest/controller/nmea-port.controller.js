"use strict";
exports.__esModule = true;
var SerialPort = require("serialport");
var NmeaPortController = /** @class */ (function () {
    function NmeaPortController() {
    }
    NmeaPortController.prototype.getAll = function (req, res) {
        SerialPort.list()
            .then(function (ports) { return res.contentType('application/json').status(200).send(ports); })["catch"](function (err) { return res.status(500).send(err); });
    };
    return NmeaPortController;
}());
exports.NmeaPortController = NmeaPortController;
