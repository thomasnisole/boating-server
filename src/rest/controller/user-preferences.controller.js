"use strict";
exports.__esModule = true;
var fs = require("fs");
var os = require("os");
var filePath = os.homedir() + '/.ng-boating';
var userPreferencesFileName = 'user-preferences.json';
var UserPreferencesController = /** @class */ (function () {
    function UserPreferencesController() {
    }
    UserPreferencesController.prototype.getAll = function (req, res) {
        if (fs.existsSync(filePath + '/' + userPreferencesFileName)) {
            res.contentType('application/json').status(200).send(fs.readFileSync(filePath + '/' + userPreferencesFileName));
        }
        else {
            res.status(404).send('Not found');
        }
    };
    UserPreferencesController.prototype.create = function (req, res) {
        if (!fs.existsSync(filePath)) {
            fs.mkdirSync(filePath);
        }
        fs.writeFileSync(filePath + '/' + userPreferencesFileName, JSON.stringify(req.body));
        res.status(201).send();
    };
    return UserPreferencesController;
}());
exports.UserPreferencesController = UserPreferencesController;
