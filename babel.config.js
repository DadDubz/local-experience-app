module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          extensions: ['.js', '.jsx', '.ts', '.tsx'],
          alias: {
            '@App': './frontend/src/App',
            '@screens': './frontend/src/screens',
            '@components': './frontend/src/components',
            '@navigation': './frontend/src/navigation',
            '@context': './frontend/src/context',
            '@services': './frontend/src/services',
          },
        },
      ],
    ],
  };
};
