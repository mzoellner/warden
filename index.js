#!/usr/bin/env node

'use strict';

// ******************************
//
//
// WARDEN v1.0.3
//
// Version History:
//
// 1.0.3
// - Stable release
//
// ******************************

// ******************************
// Utilities:
// ******************************

var cprint = require('color-print');
var fsp = require('fs-process');
var path = require('path');
var fs = require('fs');

// ******************************
// Constants:
// ******************************

const c_VERSION = '1.0.3';

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
    cprint.rainbow('Warden Help');
    cprint.white('');
    cprint.yellow('Version ' + c_VERSION);
    cprint.white('');
    cprint.green('Options:');
    cprint.white('--help\t\tShow this menu');
}

// ******************************

function printWardenInfo (in_directory) {
    var wardenFile = findWarden(in_directory);
    var currentWarden = 'Simon Young';

    if (wardenFile) {
        printWardenFile(wardenFile);
    } else {
        cprint.yellow('No warden for this area...');
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
            cprint.yellow('Too many loop iterations! Invalid top directory: ' + directory);
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

    fsp.read(in_wardenFile, function (wardenFileContents) {
        var directory = path.dirname(in_wardenFile);
        try {
            var wardenData = JSON.parse(wardenFileContents);
            console.log(in_indent + cprint.toWhite(directory) + ' ' + cprint.toCyan('=>') + ' ' + cprint.toGreen(wardenData.name));
        } catch (e) {
            cprint.yellow('Invalid warden file: ' + in_wardenFile);
            return;
        }
    });

    return true;
}

// ******************************