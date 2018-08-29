import * as http from 'http';
import {RestServer} from './app';

const PORT = 80;

const restServer: RestServer = new RestServer();

function init () {
    http.createServer(restServer.app).listen(PORT, () => {
        console.log('Express server listening on port ' + PORT);
    });
}

export default init;
