const cprint = require('color-print');
import { visitWardenFiles, Visit } from '../lib/visitWarden';
import { WardenFile, Human } from '../lib/WardenFile';
import * as inquirer from 'inquirer';
// const inquirer = require('inquirer');

export async function retireWarden(person: string): Promise<void> {
    cprint.yellow(cprint.toBold(`Retiring ${person}...`));
    
    const currentDirectory = process.cwd();

    const hasRetiredPersonFn = async (file: WardenFile) => await hasRetiredPerson(person, file);
    const visits = await visitWardenFiles(currentDirectory, hasRetiredPersonFn, null);
    const uniqueHumans = getUniqueHumans(visits);

    for (let wardenFile of visits.filter(f => f.wasFiltered === false).map(f => f.file)) {

        console.log();
        cprint.yellow('---------------------------------------------------------');
        
        await retirePerson(person, wardenFile, uniqueHumans);
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

async function retirePerson(person: string, wardenFile: WardenFile, uniqueHumans: Human[]) {
    const matchingHumans = getMatchingHumans(person, wardenFile);

    if (matchingHumans.length === 1) {
        await retireHuman(matchingHumans[0], wardenFile, uniqueHumans);
    } else {
        await retireHuman(await selectHuman(matchingHumans, wardenFile), wardenFile, uniqueHumans);
    }
};

async function selectHuman(matchingHumans: Human[], wardenFile: WardenFile): Promise<Human> {
    // TODO: Selection logic
    // For now just return first in list
    return Promise.resolve(matchingHumans[0]);
}

async function retireHuman(human: Human, wardenFile: WardenFile, uniqueHumans: Human[]): Promise<void> {
    if (wardenFile.humans.length > 1) {
        const remainingHumans = getRemainingHumans(human, wardenFile);

        const answer = await promptForRemovalOfHuman(human, remainingHumans, wardenFile);        

        if (answer.removalOfHuman === 'y') {
            await removeHumanFromWardenFile(human, wardenFile);
        } else if (answer.removalOfHuman === 'n') {
            await replaceHuman(human, wardenFile, uniqueHumans);
        } else {
            skipFile();
        }
    } else {
        const answer = await promptForReplacementOfHuman(human, wardenFile);

        if (answer.replacementOfHuman === 'y') {
            await replaceHuman(human, wardenFile, uniqueHumans);
        } else if (answer.replacementOfHuman === 'n') {
            await removeHumanFromWardenFile(human, wardenFile);
        } else {
            skipFile();
        }
    }
}

async function promptForRemovalOfHuman(human: Human, remainingHumans: Human[], wardenFile: WardenFile): Promise<any> {
    const remainingHumansString = remainingHumans.map(h => h.name).join(', ');
    
    const question = cprint.toYellow(`Suggesting to remove ${cprint.toBold(human.name)} `) + 
                  cprint.toYellow(`from ${cprint.toBold(wardenFile.filePath)} `) + 
                  cprint.toYellow(`as there is/are still ${cprint.toBold(remainingHumans.length)} `) + 
                  cprint.toYellow(`warden(s) left (${cprint.toBold(remainingHumansString)})`);

    console.log(question);
    console.log();
    const answer = await inquirer.prompt({
        type: 'list',
        name: 'removalOfHuman',
        message: cprint.toYellow(`Do you want to remove ${cprint.toBold(human.name)} `) + cprint.toYellow(`from ${cprint.toBold(wardenFile.filePath)} ?`),
        default: 'y',
        choices: [ 
            { name: `Yes, remove ${human.name} from list`, value: 'y', short: 'Yes'}, 
            { name: `No, replace ${human.name} with other person`, value: 'n', short: 'No' }, 
            { name: `No, skip this file`, value: 's', short: 'Skip' }
        ]
    });
    return answer;
}

async function promptForReplacementOfHuman(human: Human, wardenFile: WardenFile): Promise<any> {
    
    cprint.yellow(`Suggesting to replace ${human.name} ` +
                  `with another person in ${wardenFile.filePath} ` + 
                  `as there is no warden left`);
    
    const answer = await inquirer.prompt({
        type: 'list',
        name: 'replacementOfHuman',
        message: `Do you want to replace ${human.name} with another person ?`,
        choices: [
            { name: `Yes, replace ${human.name} with other person.`, value: 'y', short: 'Yes' },
            { name: `No, instead remove ${human.name} from list.`, value: 'n', short: 'No' },
            { name: `Skip this file`, value: 's', short: 'Skiup' }
        ]
    });

    return answer;
}

async function removeHumanFromWardenFile(human: Human, wardenFile: WardenFile): Promise<void> {
    cprint.green(`Removing ${human.name} from list`);
    const newHumans = wardenFile.humans.filter(h => human !== h);
    wardenFile.humans = newHumans;
}

async function replaceHuman(human: Human, wardenFile: WardenFile, uniqueHumans: Human[]) {
    type ReplacementAnswer = { replacement: Human };
    const answer = await inquirer
                .prompt<ReplacementAnswer>(
                    {
                        type: 'list',
                        name: 'replacement',
                        choices: [
                            ...uniqueHumans
                                .filter(h => h !== human)
                                .map(h => {
                                    return {
                                        name: `${h.name} <${h.email}>`,
                                        value: h
                                    };
                            })
                        ],
                        message: `Who do you want to replace ${human.name} with ?`
                    }
                );
    await replaceHumanWith(human, wardenFile, answer.replacement);
}

async function replaceHumanWith(human: Human, wardenFile: WardenFile, replacement: Human) {
    cprint.red(`Replacing ${human.name} with... ${replacement.name}`);

    const newHumans = [...wardenFile.humans.filter(h => h !== human), replacement];
    wardenFile.humans = newHumans;
}

function getRemainingHumans (human: Human, wardenFile: WardenFile): Human[] {
    return wardenFile.humans.filter(h => h !== human);
}

function skipFile (): void {
    cprint.red(`Skipping file`);
}

function getUniqueHumans (visits: Visit<WardenFile>[]) {
    const allHumans = visits.map(f => f.file.humans).reduce((acc, curr) => { return [...acc, ...curr]; }, []);
    const map = new Map();
    allHumans.forEach(h => map.set(h.email, h));
    const uniqueHumans = [...map.values()];
    return uniqueHumans;
}