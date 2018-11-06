import { WardenFile } from './WardenFile';

test('WardenFile exists', () => {
    const cwd = process.cwd();
    const testWardenLocation = `${cwd}\\test\\wardenPath\\.warden`;

    const testRun = new WardenFile(testWardenLocation);

    expect(testRun).toBeDefined();
})

test('WardenFile creates structure with provided path', () => {
    const cwd = process.cwd();
    const testWardenLocation = `${cwd}\\test\\wardenPath\\.warden`;

    const testRun = new WardenFile(testWardenLocation);

    expect(testRun.filePath).toEqual(testWardenLocation);
})

test('WardenFile creates structure with wardenfile data for provided path', () => {
    const cwd = process.cwd();
    const testWardenLocation = `${cwd}\\test\\wardenPathToo\\.warden`;

    const testRun = new WardenFile(testWardenLocation);

    const expectHumansArray = [{"email": "kevin@trademe.co.nz", "name": "Kevin"}]

    expect(testRun.humans).toEqual(expectHumansArray);
})
