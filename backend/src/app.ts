import express from 'express';
import cors from 'cors';
import { PORT } from './config/envConfig';
import fileRoutes from './routes/fileRoutes';
import webhookRoutes from './routes/webhookRoutes';
import statusRoutes from './routes/statusRoutes';
import { errorMiddleware } from './middleware/errorMiddleware';
import { startNgrok } from './services/ngrokService';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(errorMiddleware);

// Routes
app.use(fileRoutes);
app.use(webhookRoutes);
app.use(statusRoutes);


app.listen(PORT, async () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  try {
    await startNgrok();
  } catch (error) {
    console.error('Failed to start ngrok:', error);
  }
});
