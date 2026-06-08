module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // react-native-worklets/plugin must be listed LAST — required by reanimated v4
      'react-native-worklets/plugin',
    ],
  };
};
