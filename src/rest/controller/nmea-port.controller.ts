import {Request, Response} from 'express';
import * as SerialPort from 'serialport';

export class NmeaPortController {

    public getAll(req: Request, res: Response): void {
        SerialPort.list()
            .then((ports) => res.contentType('application/json').status(200).send(ports))
            .catch((err) => res.status(500).send(err));
    }
}