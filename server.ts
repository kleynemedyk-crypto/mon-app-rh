import express from 'express';
import { createServer as createViteServer } from 'vite';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware
  app.use(express.json());

  // API routes
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'HR Fusion API is running' });
  });

  // Auth routes
  app.use('/api/auth', (await import('./server/routes/auth')).default);

  // Dashboard routes (protected)
  const { protect } = await import('./server/middleware/auth');
  app.use('/api/dashboard', protect, (await import('./server/routes/dashboard')).default);

  // Planning routes (protected)
  app.use('/api/planning', protect, (await import('./server/routes/planning')).default);

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    console.log('Running in development mode, attaching Vite middleware.');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // In production, you'll serve static files from 'dist'
    // This part will be handled by the deployment build system
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
