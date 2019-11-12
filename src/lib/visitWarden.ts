import { WardenFile } from "./WardenFile";

const path = require('path');
const fs = require('fs');

export async function visitWardenFiles(
    directory: string,
    filter: ((wardenFile: WardenFile) => Promise<boolean>) | null,
    action: ((wardenFile: WardenFile) => Promise<void>) | null): Promise<WardenFile[]> {
    return await visitDirectory(directory, filter, action);
}

async function visitDirectory(
    directory: string,
    filter: ((wardenFile: WardenFile) => Promise<boolean>) | null,
    action: ((wardenFile: WardenFile) => Promise<void>) | null): Promise<WardenFile[]> {

    if(ignoreDirectory(directory)) {
        return [];
    }

    const currentWardenFile = await visitWardenFile(directory, filter, action);
    const currentWardenFileArray = currentWardenFile ? [currentWardenFile] : [];
    const wardenFiles = await visitSubdirectories(directory, filter, action);
    return [...currentWardenFileArray, ...wardenFiles];
}

function ignoreDirectory(directory: string) {
    return directory.match(/(\.hg|\.git|node_modules)/);
}

async function visitSubdirectories(
    directory: string,
    filter: ((wardenFile: WardenFile) => Promise<boolean>) | null,
    action: ((wardenFile: WardenFile) => Promise<void>) | null): Promise<WardenFile[]> {
    const subDirectories = (fs.readdirSync(directory) as string[])
        .map(f => path.resolve(directory, f))
        .map(f => ({ f, stats: fs.statSync(f)}))
        .filter(_ => _.stats.isDirectory())
        .map(_ => _.f);

    let wardenFiles: WardenFile[] = [];

    for (const subdir of subDirectories) {
        wardenFiles = [...wardenFiles, ...await visitDirectory(subdir, filter, action)];
    }

    return wardenFiles;
}

async function visitWardenFile(
    directory: string, 
    filter: ((wardenFile: WardenFile) => Promise<boolean>) | null, 
    action: ((wardenFile: WardenFile) => Promise<void>) | null): Promise<WardenFile|undefined> {
    let wardenFilePath = path.resolve(directory, '.warden');
    if (fs.existsSync(wardenFilePath)) {
        const wardenFile = new WardenFile(wardenFilePath);

        if (filter && await filter(wardenFile) === false) {
            return undefined;
        }

        if (action) {
            await action(wardenFile);
        }

        return wardenFilePath;
    }

    return undefined;
}