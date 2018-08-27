#!/usr/bin/env node

'use strict';
import { printWardensForBranch } from './commands/print-wardens-for-branch';
import { printWardenForDirectory } from './commands/print-wardens-for-dir';
const path = require('path');

// ******************************
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

const program = require('commander');

// ******************************
// Constants:
// ******************************

const c_VERSION = '1.1.0';
const wardenDescription = 
`-----------------------------

  Respository management tool.

  Run without options to print warden information for all your current changes against default.

  -----------------------------`;

// ******************************
// Script:
// ******************************

program
  .version(c_VERSION)
  .name('warden')
  .description(wardenDescription)
  .option('-d, --dir', 'print warden files for current directory')
  .parse(process.argv);
 
if (program.dir) printWardenForDirectory(process.cwd());
else printWardensForBranch();