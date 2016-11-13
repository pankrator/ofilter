'use strict';

var spawn = require('child_process').spawn;
var readline = require('readline');

var bufferedStdOutput = [];
var bufferedStdError = [];

var filterOn = '';
var outputPaused = false;

var params = process.argv.slice(2);

var running = spawn(process.argv[1], params);


running.stdout.setEncoding('utf8');

running.stdout.on('data', (data) => {
    if (outputPaused) {
        bufferedStdOutput.push(data);
        return;
    }

    if (filter(data, filterOn)) {
        console.log(data);
    }
});

running.stderr.on('data', (data) => {
    if (outputPaused) {
        bufferedStdError.push(data);
        return;
    }

    if (filter(data, filterOn)) {
        console.log(data);
    }
});

running.on('close', (code) => {
    console.log('[Main] child process exited with code ', code);
    process.exit(0);
});

readline.emitKeypressEvents(process.stdin);
process.stdin.on('keypress', function (chunk, key) {
    if (key.sequence === '\u001b') {
        if (outputPaused) {
            // process.stdin.pause();
            console.log('[Main] Output resumed');
            processBufferedOutput();
            process.exit(0);
        } else {
            process.stdin.resume();
            console.log('[Main] Output paused');
        }
        outputPaused = !outputPaused;
    }
});

var input = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

input.on('line', (line) => {
    if (outputPaused) {
        filterOn = line;
        console.log('[Main] Output will be filtered on => ', filterOn);
    }
});

function processBufferedOutput() {
    var output = bufferedStdOutput.shift();
    while(output) {
        if (filter(output, filterOn)) {
            console.log(output);
        }
        output = bufferedStdOutput.shift();
    }

    output = bufferedStdError.shift()
    while(output && filter(output, filterOn)) {
        if (filter(output, filterOn)) {
            console.err(output);
        }
        output = bufferedStdError.shift();
    }
}

function filter(message, filterText) {
    if (!message) {
        return false;
    }
    if (message.indexOf(filterText) >= 0) {
        return true;
    }
    return false;
}