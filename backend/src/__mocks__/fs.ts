import fs from 'fs';

const mockedFs = {
  existsSync: jest.fn(),
  mkdirSync: jest.fn(),
  readFileSync: jest.fn(),
  writeFileSync: jest.fn(),
};

jest.mock('fs', () => mockedFs);

export default mockedFs;
