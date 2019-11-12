#!/usr/bin/env node

'use strict';
import { printWardensForBranch } from './commands/print-wardens-for-branch';
import { printWardenForDirectory } from './commands/print-wardens-for-dir';
import { retireWarden } from './commands/retire-warden';
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
    .command(`branch`)
    .description('Print warden files for all changes on current branch <default> ')
    .action(() => printWardensForBranch());

program
    .command(`dir [searchDir]`)
    .description(`Print warden files for given directory`)
    .action((searchDir: string) => printWardenForDirectory(searchDir));

program
    .command('retire [person]')
    .description('Retire a warden')
    .action(async (person: string) => await retireWarden(person));

program
    .parse(process.argv);

if (!process.argv.slice(2).length) {
    // default command when running cli without any extra args
    printWardensForBranch();
}
