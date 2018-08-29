"use strict";
exports.__esModule = true;
var fs = require("fs");
var os = require("os");
var filePath = os.homedir() + '/.ng-boating';
var waypointsFileName = 'waypoints.json';
var WaypointController = /** @class */ (function () {
    function WaypointController() {
    }
    WaypointController.prototype.getAll = function (req, res) {
        if (!fs.existsSync(filePath + '/' + waypointsFileName)) {
            res.contentType('application/json').status(200).send([]);
        }
        else {
            res.contentType('application/json').status(200).send(fs.readFileSync(filePath + '/' + waypointsFileName));
        }
    };
    WaypointController.prototype.create = function (req, res) {
        if (fs.existsSync(filePath + '/' + waypointsFileName)) {
            var waypoints = JSON.parse(fs.readFileSync(filePath + '/' + waypointsFileName).toString());
            waypoints.push(req.body);
            fs.writeFileSync(filePath + '/' + waypointsFileName, JSON.stringify(waypoints));
        }
        res.contentType('application/json').status(201).send();
    };
    WaypointController.prototype.update = function (req, res) {
    };
    WaypointController.prototype["delete"] = function (req, res) {
    };
    return WaypointController;
}());
exports.WaypointController = WaypointController;
