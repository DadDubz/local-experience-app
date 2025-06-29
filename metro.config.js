const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');
const exclusionList = require('metro-config/src/defaults/exclusionList');

const config = getDefaultConfig(__dirname);

// Extend asset extensions
if (!config.resolver.assetExts.includes('css')) {
  config.resolver.assetExts.push('css');
}
config.resolver.assetExts.push('db'); // Custom extension

// Remove shim line (caused crash)

// Add alias for @screens and others
config.resolver.extraNodeModules = {
  ...config.resolver.extraNodeModules,
  '@screens': path.resolve(__dirname, 'frontend/src/screens'),
  '@components': path.resolve(__dirname, 'frontend/src/components'),
  '@navigation': path.resolve(__dirname, 'frontend/src/navigation'),
  '@services': path.resolve(__dirname, 'frontend/src/services'),
  '@hooks': path.resolve(__dirname, 'frontend/src/hooks'),
  '@context': path.resolve(__dirname, 'frontend/src/context'),
  '@constants': path.resolve(__dirname, 'frontend/src/constants'),
  '@types': path.resolve(__dirname, 'frontend/src/types'),
  '@utils': path.resolve(__dirname, 'frontend/src/utils')
};

// Optional watchFolders for monorepo-style resolution
config.watchFolders = [
  path.resolve(__dirname, 'frontend/src')
];

// Exclude native-only modules
config.resolver.blacklistRE = exclusionList([
  /react-native-maps\/lib\/MapMarkerNativeComponent\.js/
]);

// Transformer options
config.transformer.getTransformOptions = async () => ({
  transform: {
    experimentalImportSupport: false,
    inlineRequires: true,
  },
});

module.exports = config;
