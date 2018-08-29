import { Request, Response } from 'express';
import * as fs from 'fs';
import * as os from 'os';

const filePath = os.homedir() + '/.ng-boating';
const userPreferencesFileName = 'user-preferences.json';

export class UserPreferencesController {

    public getAll (req: Request, res: Response) {
        if (fs.existsSync(filePath + '/' + userPreferencesFileName)) {
            res.contentType('application/json').status(200).send(fs.readFileSync(filePath + '/' + userPreferencesFileName));
        } else {
            res.status(404).send('Not found');
        }
    }

    public create (req: Request, res: Response) {
        if (!fs.existsSync(filePath)) {
            fs.mkdirSync(filePath);
        }

        fs.writeFileSync(filePath + '/' + userPreferencesFileName, JSON.stringify(req.body));

        res.status(201).send();
    }
}