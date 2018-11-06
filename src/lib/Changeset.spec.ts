import { Changeset } from './Changeset';
import { WardenFile } from './WardenFile';

test('Changeset exists', () => {
    const testPathsArray = ['./', './test/'];
    const changeSet = new Changeset(testPathsArray);
    
    expect(changeSet).toBeDefined();
})

test('Should create a warden file array for specified paths', () => {
    const cwd = process.cwd();
  
    const pathOneFile = `${cwd}\\test\\wardenPath\\.warden`;
    const pathTwoFile = `${cwd}\\test\\wardenPathToo\\.warden`;

    const wardenFileOne = new WardenFile(pathOneFile);
    const wardenFileTwo = new WardenFile(pathTwoFile);
    const expectArray = [wardenFileOne, wardenFileTwo];

    const testPathsArray = [
        `${cwd}\\test\\wardenPath\\foo\\bar`, 
        `${cwd}\\test\\wardenPathToo\\foo\\bar`
    ];
    const changeSet = new Changeset(testPathsArray);

    expect(changeSet.wardenFileArray).toEqual(expectArray);
});
