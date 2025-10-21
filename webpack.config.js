const createExpoWebpackConfigAsync = require('@expo/webpack-config');
module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);
  config.resolve.alias['react-native'] = 'react-native-web';
  process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY || '';
  return config;
};