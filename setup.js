const fs = require('fs');

try {
  // Create necessary directories
  const dirs = ['.ns-plugins', '.ns-temp'];
  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });

  console.log('NativeScript setup completed successfully');
} catch (error) {
  console.error('Setup failed:', error);
  process.exit(1);
}