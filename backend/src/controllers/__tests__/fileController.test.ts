import { Request, Response } from 'express';
import fs from 'fs';
import { uploadFile } from '../fileController';
import clientRevAi from '../../services/revaiService';
import { getNgrokUrl } from '../../services/ngrokService';

// Mock dependencies
jest.mock('fs');
jest.mock('../../services/revaiService');
jest.mock('../../services/ngrokService');

describe('File Controller - uploadFile', () => {
  const mockSubmitJobAudioData = clientRevAi.submitJobAudioData as jest.Mock;
  const mockGetNgrokUrl = getNgrokUrl as jest.Mock;
  
  beforeEach(() => {
    jest.resetAllMocks();
    mockGetNgrokUrl.mockReturnValue('http://localhost:3000');
  });

  it('should return 400 if no file is uploaded', async () => {
    const req = { file: null } as unknown as Request;
    const res = { status: jest.fn().mockReturnThis(), send: jest.fn() } as unknown as Response;

    await uploadFile(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith('No file uploaded.');
  });

  it('should return 400 for invalid file type', async () => {
    const req = { file: { mimetype: 'text/plain' } } as unknown as Request;
    const res = { status: jest.fn().mockReturnThis(), send: jest.fn() } as unknown as Response;

    await uploadFile(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith('Invalid file type. Please upload an audio file.');
  });

  it('should call submitJobAudioData with correct parameters and return the job ID', async () => {
    const mockJob = { id: 'job-id' };
    mockSubmitJobAudioData.mockResolvedValue(mockJob);

    const req = {
      file: { mimetype: 'audio/mpeg', path: 'path/to/file.mp3' },
    } as unknown as Request;

    const res = {
      json: jest.fn(),
    } as unknown as Response;

    fs.createReadStream = jest.fn().mockReturnValue(Buffer.from('file content'));

    await uploadFile(req, res);

    expect(fs.createReadStream).toHaveBeenCalledWith('path/to/file.mp3');
    expect(mockSubmitJobAudioData).toHaveBeenCalledWith(expect.any(Buffer), 'file.mp3', {
      notification_config: {
        url: 'http://localhost:3000/webhook',
      },
    });
    expect(res.json).toHaveBeenCalledWith(mockJob);
  });

  it('should handle errors from submitJobAudioData', async () => {
    mockSubmitJobAudioData.mockRejectedValue(new Error('Submission error'));

    const req = {
      file: { mimetype: 'audio/mpeg', path: 'path/to/file.mp3' },
    } as unknown as Request;

    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    } as unknown as Response;

    fs.createReadStream = jest.fn().mockReturnValue(Buffer.from('file content'));

    await uploadFile(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith('Internal Server Error');
  });
});
