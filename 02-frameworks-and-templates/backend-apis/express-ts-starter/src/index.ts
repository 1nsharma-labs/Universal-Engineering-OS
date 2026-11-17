import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';

const app = express();
const PORT = process.env.PORT || 4001;

app.use(helmet());
app.use(cors());
app.use(express.json());

app.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    runtime: 'Node.js ' + process.version,
    framework: 'Express TypeScript',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

app.get('/api/v1/metrics', (_req: Request, res: Response) => {
  res.json({
    activeConnections: 12,
    memoryUsageMB: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
    servicesReady: true
  });
});

app.listen(PORT, () => {
  console.log(`Express TS Server running at http://localhost:${PORT}`);
});
