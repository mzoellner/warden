#!/usr/bin/env node

'use strict';
import { printWardensForBranch } from './commands/print-wardens-for-branch';
import { printWardenForDirectory } from './commands/print-wardens-for-dir';
const path = require('path');
const packageJSON = require('../package.json');

// ******************************
// Utilities:
// ******************************

const program = require('commander');

// ******************************
// Constants:
// ******************************

const wardenDescription = 
`-----------------------------

  Respository management tool.

  Run without commands to print warden information for all your current changes against default.

  -----------------------------`;

// ******************************
// Script:
// ******************************

program
  .version(packageJSON.version)
  .name('warden')
  .description(wardenDescription)

program
    .command(`dir`)
    .description(`print warden files for current directory`)
    .action(() => printWardenForDirectory(process.cwd()));

program
  .parse(process.argv);

if (!process.argv.slice(2).length) {
    // default command when running cli without any extra args
    printWardensForBranch();
}
