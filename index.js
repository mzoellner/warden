'use strict';

// ******************************
// Utilities:
// ******************************

var print = require('./utilities/print');
var fileUtil = require('./utilities/file');
var path = require('path');
var fs = require('fs');

// ******************************
// Constants:
// ******************************

const c_VERSION = '0.1 alpha';

// ******************************
// Globals:
// ******************************

var g_ARGV = require('minimist')(process.argv.slice(2));

// ******************************
// Script:
// ******************************

if (g_ARGV['help']) {
    wardenHelp();
} else {
    printWardenInfo(g_ARGV['dir']);
}

// ******************************
// Functions:
// ******************************

function wardenHelp () {
    print.rainbow('Warden Help');
    print.white('');
    print.yellow('Version ' + c_VERSION);
    print.white('');
    print.green('Options:');
    print.white('--help\t\tShow this menu');
}

// ******************************

function printWardenInfo (in_directory) {
    var wardenFile = findWarden(in_directory);
    var currentWarden = 'Simon Young';

    if (wardenFile) {
        printWardenFile(wardenFile);
    } else {
        print.yellow('No warden for this area...');
    }
}

// ******************************

function findWarden (in_directory) {
    if (!in_directory) {
        in_directory = './';
    }

    var directory = path.resolve(process.cwd(), in_directory);
    var oldDirectory = directory;
    var wardenFile = path.resolve(directory, '.warden');

    var maxUpwardsIteration = 100;
    var loopCount = 0;

    while (true) {
        if (fs.existsSync(wardenFile)) {
            break;
        }

        var oldDirectory = directory;
        directory = path.dirname(directory);
        if (directory === oldDirectory) {
            break;
        }

        if (loopCount++ > maxUpwardsIteration) {
            print.yellow('Too many loop iterations! Invalid top directory: ' + directory);
            break;
        }

        wardenFile = path.resolve(directory, '.warden');
    }

    if (! fs.existsSync(wardenFile)) {
        return false;
    }

    return wardenFile;
}

// ******************************

function printWardenFile (in_wardenFile, in_indent) {
    if (!in_indent) {
        in_indent = '';
    }

    fileUtil.read(in_wardenFile, function (wardenFileContents) {
        var directory = path.dirname(in_wardenFile);
        try {
            var wardenData = JSON.parse(wardenFileContents);
            console.log(in_indent + print.toWhite(directory) + ' ' + print.toCyan('=>') + ' ' + print.toGreen(wardenData.name));
        } catch (e) {
            print.yellow('Invalid warden file: ' + in_wardenFile);
            return;
        }
    });

    return true;
}

// ******************************