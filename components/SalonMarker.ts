import { Platform } from 'react-native';

// Provide a stable module path for TypeScript while resolving platform files at runtime
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let Component: any;
if (Platform.OS === 'web') {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  Component = require('./SalonMarker.web').default;
} else {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  Component = require('./SalonMarker.native').default;
}

export default Component;


