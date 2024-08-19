import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { handleWebhook } from '../webhookController';
import clientRevAi from '../../services/revaiService';

jest.mock('fs');
jest.mock('../../services/revaiService');

describe('Webhook Controller - handleWebhook', () => {
  const mockExistsSync = fs.existsSync as jest.Mock;
  const mockMkdirSync = fs.mkdirSync as jest.Mock;
  const mockWriteFileSync = fs.writeFileSync as jest.Mock;
  const mockGetTranscriptText = clientRevAi.getTranscriptText as jest.Mock;

  const transcriptionDirectory = 'transcriptions';
  const testFilePath = (jobId: string) => path.join(transcriptionDirectory, `${jobId}.txt`);

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should save the transcription when the webhook receives a valid job ID', async () => {
    const jobId = 'test-job-id';
    const transcriptText = 'This is a test transcription.';
    
    mockExistsSync.mockReturnValue(false); // Simulate that directory does not exist
    mockGetTranscriptText.mockResolvedValue(transcriptText);

    const req = { body: { job: { id: jobId } } } as unknown as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    } as unknown as Response;

    await handleWebhook(req, res);

    expect(fs.existsSync).toHaveBeenCalledWith(transcriptionDirectory);
    expect(fs.mkdirSync).toHaveBeenCalledWith(transcriptionDirectory, { recursive: true });
    expect(clientRevAi.getTranscriptText).toHaveBeenCalledWith(jobId);
    expect(fs.writeFileSync).toHaveBeenCalledWith(testFilePath(jobId), transcriptText);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith('Transcription saved');
  });

  it('should handle errors from getTranscriptText and still respond with 200', async () => {
    const jobId = 'test-job-id';

    mockExistsSync.mockReturnValue(true); // Simulate that directory already exists
    mockGetTranscriptText.mockRejectedValue(new Error('Failed to get transcript'));

    const req = { body: { job: { id: jobId } } } as unknown as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    } as unknown as Response;

    await handleWebhook(req, res);

    expect(fs.existsSync).toHaveBeenCalledWith(transcriptionDirectory);
    expect(clientRevAi.getTranscriptText).toHaveBeenCalledWith(jobId);
    expect(fs.writeFileSync).toHaveBeenCalledWith(testFilePath(jobId), 'transcription error');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith();
  });
});
