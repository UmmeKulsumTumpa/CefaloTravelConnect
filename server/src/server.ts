import app from './app.js';
import config from './app/config/app.config.js';

async function main() {
  const PORT = config.port;

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

main();

// will impelement some global error handling and logging
