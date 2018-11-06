import { findWarden } from './findWarden';

test('findWarden exists', () => {
    expect(findWarden).toBeDefined();
});

test('findWarden locates warden file', () => {
    const cwd = process.cwd();
    const expectWardenLocation = `${cwd}\\test\\wardenPath\\.warden`;
    const testWardenLocation = `${cwd}\\test\\wardenPath\\foo\\bar`;
    const testRun = findWarden(testWardenLocation);

    expect(testRun).toBe(expectWardenLocation);
});
