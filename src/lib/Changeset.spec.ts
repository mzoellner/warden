import { Changeset } from './Changeset';

const testPathsArray = ['./', './test/'];

const changeSet = new Changeset(testPathsArray);

test('test Changeset', () => {
    expect(changeSet).toBeDefined();
})
