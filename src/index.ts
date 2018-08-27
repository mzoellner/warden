#!/usr/bin/env node

'use strict';
import { printWardenInfo } from './lib/PrintService';
import { printWardensForBranch } from './commands/print-wardens-for-branch';
const path = require('path');

// ******************************
//
//
// WARDEN v1.1.0
//
// Version History:
//
// 1.1.0
// - Refactor to Changeset and Wardenfile class, restructure files
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
    cprint.white('yarn warden\tPrint warden file info for whole branch against default');
    cprint.white('');
    cprint.green('Options:');
    cprint.white('--help\t\tShow this menu');
    cprint.white('--dir\t\tPrint warden file for current directory');
}
