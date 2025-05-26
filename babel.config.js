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
            '@screens': './frontend/src/screens',
            '@components': './frontend/src/components',
            '@navigation': './frontend/src/navigation',
            '@context': './frontend/src/context',
            '@services': './frontend/src/services', // ✅ Add this
          },
        },
      ],
    ],
  };
};
