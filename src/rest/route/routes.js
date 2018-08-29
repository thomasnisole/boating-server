"use strict";
exports.__esModule = true;
var user_preferences_controller_1 = require("../controller/user-preferences.controller");
var waypoint_controller_1 = require("../controller/waypoint.controller");
var nmea_port_controller_1 = require("../controller/nmea-port.controller");
var Routes = /** @class */ (function () {
    function Routes() {
        this.userPreferencesController = new user_preferences_controller_1.UserPreferencesController();
        this.waypointController = new waypoint_controller_1.WaypointController();
        this.nmeaPortController = new nmea_port_controller_1.NmeaPortController();
    }
    Routes.prototype.routes = function (app) {
        app.route('/').get(function (req, res) {
            res.status(200).sendFile('../public/index.html');
        });
        app.route('/nmea-ports').get(this.nmeaPortController.getAll);
        app.route('/user-preferences').get(this.userPreferencesController.getAll);
        app.route('/user-preferences').post(this.userPreferencesController.create);
        app.route('/waypoints').get(this.waypointController.getAll);
        app.route('/waypoints').post(this.waypointController.create);
        app.route('/waypoints').put(this.waypointController.update);
        app.route('/waypoints')["delete"](this.waypointController["delete"]);
    };
    return Routes;
}());
exports.Routes = Routes;
