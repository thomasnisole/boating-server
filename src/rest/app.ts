import * as express from "express";
import * as bodyParser from "body-parser";
import {Routes} from './route/routes';

export class RestServer {

    public app: express.Application;

    public routePrv: Routes = new Routes();

    public constructor() {
        this.app = express();
        this.config();
        this.routePrv.routes(this.app);
    }

    private config(): void{
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: false }));
        // serving static files
        this.app.use(express.static('public'));

        this.app.use((req, res, next) => {
            res.header('Access-Control-Allow-Origin', 'http://localhost:4200');
            res.header('Access-Control-Allow-Credentials', 'true');
            res.header('Access-Control-Allow-Headers', 'Content-Type');

            next();
        });
    }
}