#!/usr/bin/env node

'use strict';
import {printWardenInfo} from "./print";

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

const cprint = require('color-print');

// ******************************
// Constants:
// ******************************

const c_VERSION = '1.0.3';

// ******************************
// Globals:
// ******************************

const g_ARGV = require('minimist')(process.argv.slice(2));

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
