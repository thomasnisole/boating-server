const PORT = 80;

const SerialPort = require('serialport');
const parsers = SerialPort.parsers;

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const server = require('http').createServer(app);
const io = require('socket.io')(server);

const os = require('os');
const fs = require('fs');
const nmea = require('nmea-simple');

app.use(bodyParser.json());
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:4200');
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');

    next();
});

app.use(express.static('../public'));
app.get('/', (req, res) => {
    res.sendFile('../public/index.html');
});


const filePath = os.homedir() + '/.ng-boating';
const userPreferencesFileName = 'user-preferences.json';
const waypointsFileName = 'waypoints.json';

app.get('/nmea-ports', (req, res) => {
    SerialPort.list()
        .then((ports) => res.contentType('application/json').status(200).send(ports))
        .catch((err) => res.status(500).send(err));
});

app.get('/user-preferences', (req, res) => {
    if (fs.existsSync(filePath + '/' + userPreferencesFileName)) {
        res.contentType('application/json').status(200).send(fs.readFileSync(filePath + '/' + userPreferencesFileName));
    } else {
        res.status(404).send('Not found');
    }
});

app.post('/user-preferences', (req, res) => {
    if (!fs.existsSync(filePath)) {
        fs.mkdir(filePath);
    }

    fs.writeFileSync(filePath + '/' + userPreferencesFileName, JSON.stringify(req.body));

    res.status(201).send();
});

app.get('/waypoints', (req, res) => {
    if (!fs.existsSync(filePath + '/' + waypointsFileName)) {
        res.contentType('application/json').status(200).send([]);
    } else {
        res.contentType('application/json').status(200).send(fs.readFileSync(filePath + '/' + waypointsFileName))
    }
});

app.get('/waypoints/:waypoint', (req, res) => {
    if (!fs.existsSync(filePath + '/' + waypointsFileName)) {
        res.status(404).send('Not found');

        return;
    }

    const waypoints = JSON.parse(fs.readFileSync(filePath + '/' + waypointsFileName));
    const waypoint = waypoints.find((waypoint) => waypoint.id === req.params['waypoint']);

    if (!waypoint) {
        res.status(404).send('Not found');

        return;
    }

    res.contentType('application/json').status(200).send(JSON.stringify(waypoint));
});

app.post('/waypoints', (req, res) => {
    if (fs.existsSync(filePath + '/' + waypointsFileName)) {
        const waypoints = JSON.parse(fs.readFileSync(filePath + '/' + waypointsFileName));
        waypoints.push(req.body);
        fs.writeFileSync(filePath + '/' + waypointsFileName, JSON.stringify(waypoints));
    }
    res.contentType('application/json').status(201).send();
});

app.put('/waypoints/:waypoint', (req, res) => {
    if (!fs.existsSync(filePath + '/' + waypointsFileName)) {
        res.status(404).send('Not found');

        return;
    }

    const waypoints = JSON.parse(fs.readFileSync(filePath + '/' + waypointsFileName));
    const waypoint = waypoints.find((waypoint) => waypoint.id === req.params['waypoint']);

    if (!waypoint) {
        res.status(404).send('Not found');

        return;
    }

    waypoint.id = req.body.id;
    waypoint.name = req.body.name;
    waypoint.description = req.body.description;
    waypoint.lat = req.body.lat;
    waypoint.lng = req.body.lng;

    fs.writeFileSync(filePath + '/' + waypointsFileName, JSON.stringify(waypoints));

    res.status(202).send();
});

app.delete('/waypoints/:waypoint', (req, res) => {
    if (!fs.existsSync(filePath + '/' + waypointsFileName)) {
        res.status(404).send('Not found');

        return;
    }

    let waypoints = JSON.parse(fs.readFileSync(filePath + '/' + waypointsFileName));
    waypoints = waypoints.filter((waypoint) => waypoint.id !== req.params['waypoint']);

    fs.writeFileSync(filePath + '/' + waypointsFileName, JSON.stringify(waypoints));

    res.status(204).send();
});


server.listen(PORT, () => {
    console.log('listening on ' + PORT);
});

let port = null;
let parser = null;
let connected = false;

io.on('connect', (socket) => {
    console.log('a user connected');

    socket.on('close', () => {
        port.close();
        port = null;
        parser = null;
        connected = false;
    });

    socket.on('openPort', (message, fn) => {
        console.log(message);
        if (parser && port && connected) {
            if (message.port !== port.path) {
                fn('A different port is already opened');
            }
            fn();
        } else {
            parser = new parsers.Readline({
                delimiter: '\r\n'
            });
            port = new SerialPort(
                message.port,
                {
                    // autoOpen: false,
                    baudRate: message.baudRate,
                    lock: false
                },
                (err) => {
                    if (err) {
                        port = null;
                        parser = null;

                        fn(err.toString());
                    } else {
                        console.log('connected', message.port);
                        connected = true;
                        fn();
                    }
                }
            );

            port.pipe(parser);

            parser.on('data', (line) => {
                // fs.appendFileSync('C:/tmp/trace.nmea', line.toString() + '\r\n');
                const packet = nmea.parseNmeaSentence(line);
                console.log(line);
                io.emit('/nmea/ALL', line);
                io.emit('/nmea/' + packet.talkerId + packet.sentenceId, line);
                /// socket.emit('data', '$GPRMC,170727.683,A,4835.1100,N,00159.8096,W,002.3,314.8,060918,,,A*7C');
            });

            port.on('close', () => {
                socket.emit('closePort');
                connected = false;
            });
        }
    });
});