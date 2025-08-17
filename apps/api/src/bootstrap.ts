import { register } from 'tsconfig-paths';
import * as path from 'path';

// Register tsconfig paths
register({
  baseUrl: path.resolve(__dirname, '..'),
  paths: {
    'src/*': ['src/*']
  }
});

// Now import and start the actual application
import('./main');