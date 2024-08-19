import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { checkStatus } from '../statusController';

jest.mock('fs');

describe('Status Controller - checkStatus', () => {
  const mockExistsSync = fs.existsSync as jest.Mock;
  const mockReadFileSync = fs.readFileSync as jest.Mock;

  const transcriptionDirectory = 'transcriptions';
  const testFilePath = (jobId: string) => path.join(transcriptionDirectory, `${jobId}.txt`);

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should return 200 and file content if the transcription file exists', () => {
    const jobId = 'test-job-id';
    const fileContent = 'This is a test transcription.';
    mockExistsSync.mockReturnValue(true);
    mockReadFileSync.mockReturnValue(fileContent);

    const req = { params: { job_id: jobId } } as unknown as Request;
    const res = {
      json: jest.fn(),
    } as unknown as Response;

    checkStatus(req, res);

    expect(fs.existsSync).toHaveBeenCalledWith(testFilePath(jobId));
    expect(fs.readFileSync).toHaveBeenCalledWith(testFilePath(jobId), 'utf-8');
    expect(res.json).toHaveBeenCalledWith({ finished: true, content: fileContent });
  });

  it('should return 200 with finished: false if the transcription file does not exist', () => {
    const jobId = 'test-job-id';
    mockExistsSync.mockReturnValue(false);

    const req = { params: { job_id: jobId } } as unknown as Request;
    const res = {
      json: jest.fn(),
    } as unknown as Response;

    checkStatus(req, res);

    expect(fs.existsSync).toHaveBeenCalledWith(testFilePath(jobId));
    expect(res.json).toHaveBeenCalledWith({ finished: false });
  });
});
