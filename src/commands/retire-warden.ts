const cprint = require('color-print');
import { visitWardenFiles } from '../lib/visitWarden';
import { WardenFile, Human } from '../lib/WardenFile';
const inquirer = require('inquirer');

export async function retireWarden(person: string): Promise<void> {
    cprint.yellow(`Retiring ${person}...`);
    cprint.yellow();

    const currentDirectory = process.cwd();

    const hasRetiredPersonFn = async (file: WardenFile) => await hasRetiredPerson(person, file);
    const wardenFiles = await visitWardenFiles(currentDirectory, hasRetiredPersonFn, null);

    for (let wardenFile of wardenFiles) {
        await retirePerson(person, wardenFile);
        cprint.green(wardenFile.filePath);
        wardenFile.saveToDisk();
    }
};

async function hasRetiredPerson(person: string, wardenFile: WardenFile): Promise<boolean> {
    const hasRetiredPerson = getMatchingHumans(person, wardenFile).length >= 1;
    return Promise.resolve(hasRetiredPerson);
}

function getMatchingHumans(person: string, wardenFile: WardenFile): Human[] {
    const humans = wardenFile.humans;

    const matchEmail = (person: string, human: Human) => human.email.match(person);
    const matchName = (person: string, human: Human) => human.name.match(person);

    return humans.filter(human => matchEmail(person, human) || matchName(person, human));
}

async function retirePerson(person: string, wardenFile: WardenFile) {
    const matchingHumans = getMatchingHumans(person, wardenFile);

    if (matchingHumans.length === 1) {
        await retireHuman(matchingHumans[0], wardenFile);
    } else {
        await retireHuman(await selectHuman(matchingHumans, wardenFile), wardenFile);
    }
};

async function selectHuman(matchingHumans: Human[], wardenFile: WardenFile): Promise<Human> {
    // TODO: Selection logic
    // For now just return first in list
    return Promise.resolve(matchingHumans[0]);
}

async function retireHuman(human: Human, wardenFile: WardenFile): Promise<void> {
    if (wardenFile.humans.length > 1) {
        const remainingHumans = getRemainingHumans(human, wardenFile);

        const answer = await promptForRemovalOfHuman(human, remainingHumans, wardenFile);        

        if (answer.confirm === 'y') {
            cprint.red(`Removing ${human.name} from list`);
            await removeHumanFromWardenFile(human, wardenFile);
        } else if (answer.confirm === 'n') {
            cprint.red(`Replacing ${human.name} with...`);
        } else {
            cprint.red(`Skipping file`)
        }
    } else {
        cprint.green(`Replacing ${human.name} in ${wardenFile.filePath} with: `);
        
    }
}

function getRemainingHumans (human: Human, wardenFile: WardenFile): Human[] {
    return wardenFile.humans.filter(h => h !== human);
}

async function promptForRemovalOfHuman(human: Human, remainingHumans: Human[], wardenFile: WardenFile): Promise<any> {
    const remainingHumansString = remainingHumans.map(h => h.name).join(',');
    
    cprint.yellow(`Suggesting to remove ${human.name} ` + 
                  `from ${wardenFile.filePath} as there ` + 
                  `is/are still ${remainingHumans.length} ` + 
                  `warden(s) left (${remainingHumansString})`);
    
    const answer = await inquirer.prompt({
        type: 'list',
        name: 'confirm',
        message: 'Foo delete foo',
        default: 's',
        choices: [ 
            { name: `Yes, remove ${human.name} from list`, value: 'y', short: 'Yes'}, 
            { name: `Replace ${human.name} with other person`, value: 'n', short: 'No' }, 
            { name: `Skip this file`, value: 's', short: 'Skip' }
        ]
    });
    return answer;
}

async function removeHumanFromWardenFile(human: Human, wardenFile: WardenFile): Promise<void> {
    const newHumans = wardenFile.humans.filter(h => human !== h);
    wardenFile.humans = newHumans;
}

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

