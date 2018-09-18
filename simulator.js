const SerialPort = require('serialport');
const LineByLineReader = require('line-by-line');

const port = new SerialPort('COM3', {
    autoOpen: false,
    baudRate: 4800,
    lock: false
});

port.on('error', function(err) {
    console.log('Error: ', err.message)
});

port.open((err) => {
    if (err) {
        return;
    }
    console.log('connected on port COM3');

    constructLr();

    function constructLr() {
        const lr = new LineByLineReader('c:/tmp/trace.nmea');

        lr.on('error', function (err) {
            console.log('error', err);
        });

        lr.on('end', function () {
            console.log('end');

            constructLr();
        });

        lr.on('line', function (line) {
            port.write(line + '\r\n', function(err) {
                if (err) {
                    return console.log('Error on write: ', err.message)
                }
                console.log(line + '\r\n');
            });
            lr.pause();

            setTimeout(function () {
                lr.resume();
            }, 500);
        });
    }

});