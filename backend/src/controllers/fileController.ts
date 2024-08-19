import { Request, Response } from 'express';
import fs from 'fs';
import clientRevAi from '../services/revaiService';
import { getNgrokUrl } from '../services/ngrokService';

export const uploadFile = async (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  const allowedTypes = ['audio/mpeg', 'audio/wav', 'audio/mp3', 'audio/x-wav'];
  const fileType = req.file.mimetype;

  if (!allowedTypes.includes(fileType)) {
    return res.status(400).send('Invalid file type. Please upload an audio file.');
  }

  const params = {
    notification_config: {
      url: `${getNgrokUrl()}/webhook`,
    },
  };

  const stream = fs.createReadStream(req.file.path);

  try {
    const job = await clientRevAi.submitJobAudioData(stream, 'file.mp3', params);
    res.json(job);
  } catch (error) {
    console.error('Error submitting job:', error);
    res.status(500).send('Internal Server Error');
  }
};
