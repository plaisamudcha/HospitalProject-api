import app from './app';
import config from './config/config';

type ListenError = Error & {
  syscall?: string;
  code?: string;
};

type ShutdownSignal = 'SIGINT' | 'SIGTERM';

const server = app.listen(config.port, () => {
  console.log(
    `Server is running on port ${config.port} in ${config.nodeEnv} mode.`,
  );
});

server.on('error', (error: ListenError) => {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind =
    typeof config.port === 'string'
      ? `Pipe ${config.port}`
      : `Port ${config.port}`;

  switch (error.code) {
    case 'EACCES':
      console.error(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
});

server.on('listening', () => {
  const address = server.address();
  const bind =
    typeof address === 'string' ? `pipe ${address}` : `port ${address?.port}`;
  console.log(`Listening on ${bind}`);
});

server.on('close', () => {
  console.log('Server closed');
});

let isShuttingDown = false;

const gracefulShutdown = (signal: ShutdownSignal): void => {
  if (isShuttingDown) {
    return;
  }

  isShuttingDown = true;
  console.log(`${signal} received. Shutting down gracefully...`);

  server.close((error?: Error) => {
    if (error) {
      console.error('Error during server shutdown:', error);
      process.exit(1);
      return;
    }

    process.exit(0);
  });
};

process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
