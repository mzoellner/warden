const cprint = require('color-print');
import { visitWardenFiles } from '../lib/visitWarden';
import { WardenFile } from '../lib/WardenFile';
const inquirer = require('inquirer');

export async function retireWarden(person: string) {
    cprint.yellow(`retiring ${person}`);

    const currentDirectory = process.cwd();

    const hasRetiredPersonFn = async (file: WardenFile) => await hasRetiredPerson(person, file);
    const wardenFiles = await visitWardenFiles(currentDirectory, hasRetiredPersonFn, null);
};

async function hasRetiredPerson(person: string, wardenFile: WardenFile): Promise<boolean> {
    const humans = wardenFile.humans;
    const emails = humans.map(human => human.email);
    const matchingEmails = emails.filter(email => email.match(person));
    return Promise.resolve(matchingEmails.length >= 1);
}

// async function visitWarden(wardenFilePath: string, person: string) {
//     const wardenFile = new WardenFile(wardenFilePath);
    

//     if(matchingEmails.length == 1) {
//         await retirePerson(person, wardenFile, emails);
//     } else {
//         await findCorrectPerson(person, wardenFile);

//     }

//     // TODO: what if we have more than one email match ?
// }

async function retirePerson(person: string, wardenFile: WardenFile, emails: string[]) {
    cprint.green(`${person}`);

        if (emails.length > 1) {
            cprint.yellow(`Removing ${person} from ${wardenFile.filePath} as there are still ${emails.length - 1} wardens left`);
            const answers = await inquirer.prompt({
                type: 'list',
                name: 'confirm',
                message: 'Foo delete foo',
                default: 's',
                choices: [ 
                    { name: `Yes, remove ${person} from list`, value: 'y', short: 'Yes'}, 
                    { name: `Replace ${person} with other person`, value: 'n', short: 'No' }, 
                    { name: `Skip this file`, value: 's', short: 'Skip' }
                ]
            });

            if (answers.confirm === 'y') {
                cprint.red(`Removing ${person} from list`);
            } else if (answers.confirm === 'n') {
                cprint.red(`Replacing ${person} with...`);
            } else {
                cprint.red(`Skipping file`)
            }
        } else {
            cprint.green(`Replacing ${person} in ${wardenFile.filePath} with: `);
            
        }
};

async function replacePerson(person: string, wardenFile: WardenFile) {
    const answers = await inquirer
                .prompt([
                    {
                        type: 'input',
                        name: 'replacement',
                        message: `Who do you want to replace ${person} with ?`
                    }
                ]);
            console.log(answers);
}

