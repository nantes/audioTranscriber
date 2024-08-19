import { Router } from 'express';
import { uploadFile } from '../controllers/fileController';
import multer from 'multer';

const router = Router();
const upload = multer({ dest: 'uploads/' });

router.post('/upload', upload.single('audio'), uploadFile);

export default router;
