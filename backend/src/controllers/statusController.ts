import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';

const transcriptionDirectory = 'transcriptions';

export const checkStatus = (req: Request, res: Response) => {
  const jobId = req.params?.job_id;
  const filePath = path.join(transcriptionDirectory, `${jobId}.txt`);

  if (fs.existsSync(filePath)) {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    return res.json({ finished: true, content: fileContent });
  } else {
    return res.json({ finished: false });
  }
};
