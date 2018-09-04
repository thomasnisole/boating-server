import {EventEmitter} from 'events';
const SerialPort = require('serialport');
const parsers = SerialPort.parsers;

export class NmeaServer {

    private connected: boolean = false;

    private parser;

    private port;

    public onOpen: EventEmitter;

    public onClose: EventEmitter;

    public onError: EventEmitter;

    public onData: EventEmitter;

    public constructor() {
        this.onOpen = new EventEmitter();
        this.onClose = new EventEmitter();
        this.onError = new EventEmitter();
        this.onData = new EventEmitter();
    }

    public close(): void {
        this.port.close();
    }

    public open(port: string, baudRate: number): void {
        if (this.parser && this.port && this.connected) {
            if (port !== this.port.path) {
                this.onError.emit('A different port is already opened');
            }

            this.onOpen.emit('');

            return;
        }

        this.parser = new parsers.Readline({
            delimiter: '\r\n'
        });
        this.port = new SerialPort(
            port,
            {
                autoOpen: false,
                baudRate: baudRate,
                lock: false
            }
        );

        this.port.pipe(this.parser);

        this.parser.on('data', (line: string) => {
            this.onData.emit(line);
        });

        this.port.on('close', () => {
            this.port = null;
            this.parser = null;
            this.connected = false;
        });

        this.port.open((err) => {
            if (err) {
                this.port = null;
                this.parser = null;
                this.connected = false;

                this.onError.emit(err.toString());
            } else {
                this.connected = true;
                this.onOpen.emit('');
            }
        });
    }
}