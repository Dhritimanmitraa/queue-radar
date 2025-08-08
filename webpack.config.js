const createExpoWebpackConfigAsync = require('@expo/webpack-config');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);

  // Fix: route every react-native* request to react-native-web
  config.resolve.alias['react-native'] = 'react-native-web';

  // Ensure public env var is passed through for web bundle
  process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY || '';

  return config;
}; 