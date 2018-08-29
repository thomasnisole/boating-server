import {Request, Response} from "express";
import {UserPreferencesController} from '../controller/user-preferences.controller';
import {WaypointController} from '../controller/waypoint.controller';
import {NmeaPortController} from '../controller/nmea-port.controller';

export class Routes {

    public userPreferencesController: UserPreferencesController = new UserPreferencesController();

    public waypointController: WaypointController = new WaypointController();

    public nmeaPortController: NmeaPortController = new NmeaPortController();

    public routes(app): void {
        app.route('/').get((req: Request, res: Response) => {
            res.status(200).sendFile('../public/index.html');
        });

        app.route('/nmea-ports').get(this.nmeaPortController.getAll);

        app.route('/user-preferences').get(this.userPreferencesController.getAll);
        app.route('/user-preferences').post(this.userPreferencesController.create);

        app.route('/waypoints').get(this.waypointController.getAll);
        app.route('/waypoints').post(this.waypointController.create);
        app.route('/waypoints').put(this.waypointController.update);
        app.route('/waypoints').delete(this.waypointController.delete);
    }
}