import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import clientRevAi from '../services/revaiService';

const transcriptionDirectory = 'transcriptions';

export const handleWebhook = async (req: Request, res: Response) => {
  const jobId = req.body?.job?.id;

  try {
    if (!fs.existsSync(transcriptionDirectory)) {
      fs.mkdirSync(transcriptionDirectory, { recursive: true });
    }

    const transcriptText = await clientRevAi.getTranscriptText(jobId);
    fs.writeFileSync(path.join(transcriptionDirectory, `${jobId}.txt`), transcriptText);
    res.status(200).send('Transcription saved');
  } catch (e) {
    fs.writeFileSync(path.join(transcriptionDirectory, `${jobId}.txt`), 'transcription error');
    // send 200 on Error to stop receiving this webhook job
    res.status(200).send();
  }
};
