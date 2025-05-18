module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          alias: {
            '@App': './App',
            '@screens': './src/screens',
            '@components': './src/components',
            '@navigation': './src/navigation',
            '@context': './src/context',
          },
        },
      ],
    ],
  };
};
