#!/usr/bin/env node

'use strict';
import { printWardenInfo } from './print';
import { printWardensForBranch } from './commands/print-wardens-for-branch';
const path = require('path');

// ******************************
//
//
// WARDEN v1.0.3
//
// Version History:
//
// 1.1.0
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

const c_VERSION = '1.1.0';

// ******************************
// Globals:
// ******************************

const g_ARGV = require('minimist')(process.argv.slice(2));

// ******************************
// Script:
// ******************************
if (g_ARGV['help']) {
    wardenHelp();
} else if (g_ARGV['dir']) {
    console.log(__dirname);
    printWardenInfo(process.cwd());
} else {
    printWardensForBranch();
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
