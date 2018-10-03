import { Changeset } from './Changeset';
import { WardenFile } from './WardenFile';

test('Changeset exists', () => {
    const testPathsArray = ['./', './test/'];
    const changeSet = new Changeset(testPathsArray);
    
    expect(changeSet).toBeDefined();
})

test('Should create a warden file array for specified paths', () => {
    const cwd = process.cwd();
    const pathOne = `${cwd}\\test\\wardenPath\\foo\\bar`;
    const pathTwo = `${cwd}\\test\\wardenPathToo\\foo\\bar`;
    const testPathsArray = [pathOne, pathTwo];

    const pathOneFile = `${cwd}\\test\\wardenPath\\.warden`;
    const pathTwoFile = `${cwd}\\test\\wardenPathToo\\.warden`;

    const wardenFileOne = new WardenFile(pathOneFile);
    const wardenFileTwo = new WardenFile(pathTwoFile);
    const expectArray = [wardenFileOne, wardenFileTwo];

    const changeSet = new Changeset(testPathsArray);

    expect(changeSet.wardenFileArray).toEqual(expectArray);
});

// test('should create a warden file map for specified paths', () => {
//     const cwd = process.cwd();
//     const pathOne = `${cwd}\\test\\wardenPath\\foo\\bar`;
//     const pathTwo = `${cwd}\\test\\wardenPathToo\\foo\\bar`;
//     const testPathsArray = [pathOne, pathTwo];

//     const expectedWardenMap = new Map();

//     const changeSet = new Changeset(testPathsArray);
    
//     expect(changeSet).toEqual(expectedWardenMap);
// });
