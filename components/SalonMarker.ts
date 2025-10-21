import { Platform } from 'react-native';
let Component: any;
if (Platform.OS === 'web') {
  Component = require('./SalonMarker.web').default;
} else {
  Component = require('./SalonMarker.native').default;
}
export default Component;