import { Router } from 'express';
import { checkStatus } from '../controllers/statusController';

const router = Router();

router.get('/check/:job_id', checkStatus);

export default router;
