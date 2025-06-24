const { getDefaultConfig } = require('expo/metro-config');
const exclusionList = require('metro-config/src/defaults/exclusionList');

const config = getDefaultConfig(__dirname);

// Extend asset extensions (e.g., for .css if needed)
if (!config.resolver.assetExts.includes('css')) {
  config.resolver.assetExts.push('css');
}
config.resolver.assetExts.push('db'); // Your custom extension

// Exclude native-only modules
config.resolver.blacklistRE = exclusionList([
  /react-native-maps\/lib\/MapMarkerNativeComponent\.js/
]);

// Optional: Map a shim for native-only modules on web
config.resolver.extraNodeModules = {
  'react-native-maps': require.resolve('./shim/react-native-maps.js'),
};

// Transformer options
config.transformer.getTransformOptions = async () => ({
  transform: {
    experimentalImportSupport: false,
    inlineRequires: true,
  },
});

module.exports = config;
