// metro.config.js
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// ✅ Add 'css' support for web bundling
if (config.resolver.assetExts && !config.resolver.assetExts.includes('css')) {
  config.resolver.assetExts.push('css');
}

// ✅ Add transform options
config.transformer.getTransformOptions = async () => ({
  transform: {
    experimentalImportSupport: false,
    inlineRequires: true,
  },
});

module.exports = config;