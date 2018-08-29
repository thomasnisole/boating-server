import { Request, Response } from 'express';
import * as fs from 'fs';
import * as os from 'os';

const filePath = os.homedir() + '/.ng-boating';
const waypointsFileName = 'waypoints.json';

export class WaypointController {

    public getAll(req: Request, res: Response): void {
        if (!fs.existsSync(filePath + '/' + waypointsFileName)) {
            res.contentType('application/json').status(200).send([]);
        } else {
            res.contentType('application/json').status(200).send(fs.readFileSync(filePath + '/' + waypointsFileName))
        }
    }

    public create(req: Request, res: Response): void {
        if (fs.existsSync(filePath + '/' + waypointsFileName)) {
            const waypoints = JSON.parse(fs.readFileSync(filePath + '/' + waypointsFileName).toString());
            waypoints.push(req.body);
            fs.writeFileSync(filePath + '/' + waypointsFileName, JSON.stringify(waypoints));
        }
        res.contentType('application/json').status(201).send();
    }

    public update(req: Request, res: Response): void {

    }

    public delete(req: Request, res: Response): void {

    }
}